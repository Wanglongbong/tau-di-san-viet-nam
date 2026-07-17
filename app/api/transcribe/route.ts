import OpenAI from "openai";
import { z } from "zod";
import { matchDestination } from "@/lib/destinations";
import { rateLimitHeaders, takeRateLimit } from "@/lib/server/rate-limit";
import { sessionIdFromRequest } from "@/lib/server/session";

const MAX_AUDIO_BYTES = 3 * 1024 * 1024;
const TRANSCRIBE_REQUESTS_PER_MINUTE = 6;

const metadataSchema = z.object({
  language: z.enum(["vi", "en"]).default("vi"),
});

const acceptedAudioTypes = new Set([
  "audio/flac",
  "audio/mp4",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "audio/x-m4a",
  "audio/x-wav",
  "video/mp4",
  "video/ogg",
  "video/webm",
]);

function errorResponse(message: string, status: number, headers?: HeadersInit) {
  return Response.json({ error: message }, {
    status,
    headers: { "cache-control": "no-store", ...headers },
  });
}

function normalizedMediaType(file: File) {
  return file.type.split(";", 1)[0]?.trim().toLowerCase() ?? "";
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_AUDIO_BYTES + 128 * 1024) {
    return errorResponse("audio-too-large", 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorResponse("invalid-multipart-request", 400);
  }

  const sessionId = sessionIdFromRequest(request, form.get("sessionId"));
  if (!sessionId) return errorResponse("invalid-session", 400);

  const metadata = metadataSchema.safeParse({ language: form.get("language") || "vi" });
  if (!metadata.success) return errorResponse("invalid-language", 400);

  const audio = form.get("audio");
  if (!(audio instanceof File) || audio.size === 0) {
    return errorResponse("audio-required", 400);
  }
  if (audio.size > MAX_AUDIO_BYTES) return errorResponse("audio-too-large", 413);
  if (!acceptedAudioTypes.has(normalizedMediaType(audio))) {
    return errorResponse("unsupported-audio-type", 415);
  }

  const rateLimit = takeRateLimit("transcribe", sessionId, TRANSCRIBE_REQUESTS_PER_MINUTE);
  const headers = rateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) return errorResponse("rate-limit-exceeded", 429, headers);

  if (!process.env.OPENAI_API_KEY) {
    return errorResponse("transcription-unavailable", 503, headers);
  }

  const prompts = {
    vi: "Yêu cầu chọn một ga trên Tàu Di Sản: Kinh Bắc, Bắc Ninh, Hà Nội, Huế, Ninh Thuận, Bình Thuận, Nam Bộ hoặc Sài Gòn.",
    en: "A destination request for the Heritage Train: Kinh Bac, Bac Ninh, Hanoi, Hue, Ninh Thuan, Binh Thuan, Southern Vietnam, or Saigon.",
  } as const;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const transcription = await client.audio.transcriptions.create({
      file: audio,
      model: process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe",
      language: metadata.data.language,
      prompt: prompts[metadata.data.language],
      response_format: "json",
    });
    const transcript = transcription.text.trim().slice(0, 1_000);
    const match = matchDestination(transcript);

    return Response.json({
      transcript,
      status: match.status,
      destinationId: match.destinationId,
    }, { headers });
  } catch {
    return errorResponse("transcription-failed", 502, headers);
  }
}
