import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { approvedSourceIds, getSource, getStop } from "@/lib/heritage";
import type { GuideResponse, Language } from "@/lib/types";

const requestSchema = z.object({
  stopId: z.string().min(2).max(80),
  hotspotId: z.string().min(2).max(80),
  question: z.string().trim().min(2).max(300),
  language: z.enum(["vi", "en"]),
});

const responseSchema = z.object({
  answer: z.string().min(1).max(900),
  sourceIds: z.array(z.string()).max(4),
  grounded: z.boolean(),
  refusalReason: z.string().nullable(),
});

const refusal = (language: Language, reason = "insufficient-source"): GuideResponse => ({
  answer: language === "vi"
    ? "Kho tư liệu hiện chưa có đủ căn cứ để trả lời câu hỏi này. Bạn có thể mở nguồn gốc ở cuối thẻ để đọc hồ sơ đầy đủ."
    : "The archive does not contain enough verified evidence to answer that question. Open the primary source at the end of this card for the full record.",
  sourceIds: [],
  grounded: false,
  refusalReason: reason,
  mode: "refusal",
});

function verifiedFallback(language: Language, stopId: string, hotspotId: string): GuideResponse {
  const stop = getStop(stopId);
  const hotspot = stop?.hotspots.find((item) => item.id === hotspotId);
  if (!stop || !hotspot) return refusal(language, "record-not-found");
  return {
    answer: `${hotspot.story[language]} ${hotspot.facts[0]?.[language] ?? ""}`.trim(),
    sourceIds: hotspot.sourceIds.filter((id) => approvedSourceIds.has(id)),
    grounded: true,
    refusalReason: null,
    mode: "verified-fallback",
  };
}

const questionWords = new Set([
  "ai", "cai", "chi", "co", "do", "gi", "la", "nao", "nay", "tai", "the", "vi", "sao",
  "about", "does", "how", "important", "is", "it", "tell", "that", "the", "this", "what", "why",
]);

function normalizedTokens(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .match(/[a-z0-9]+/g)?.filter((word) => word.length > 2 && !questionWords.has(word)) ?? [];
}

function isQuestionGrounded(question: string, stop: NonNullable<ReturnType<typeof getStop>>, hotspot: NonNullable<ReturnType<typeof getStop>>["hotspots"][number]) {
  const normalizedQuestion = question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
  const asksAboutCurrentRecord = /^(vi sao|tai sao).*(chi tiet|do vat|vat nay|dieu nay).*(quan trong|dang chu y)/.test(normalizedQuestion)
    || /^(why|how).*(this|it).*(important|matter)/.test(normalizedQuestion);
  if (asksAboutCurrentRecord) return true;
  const context = JSON.stringify({
    title: stop.title,
    location: stop.location,
    description: stop.description,
    label: hotspot.label,
    kicker: hotspot.kicker,
    story: hotspot.story,
    facts: hotspot.facts,
  });
  const contextTokens = new Set(normalizedTokens(context));
  const meaningfulQuestionTokens = normalizedTokens(question);
  return meaningfulQuestionTokens.length === 0 || meaningfulQuestionTokens.some((token) => contextTokens.has(token));
}

export async function POST(request: Request) {
  let parsed: z.infer<typeof requestSchema>;
  try {
    parsed = requestSchema.parse(await request.json());
  } catch {
    return Response.json(refusal("vi", "invalid-request"), { status: 400 });
  }

  const stop = getStop(parsed.stopId);
  const hotspot = stop?.hotspots.find((item) => item.id === parsed.hotspotId);
  if (!stop || !hotspot || hotspot.sourceIds.some((id) => !approvedSourceIds.has(id))) {
    return Response.json(refusal(parsed.language, "unapproved-record"), { status: 404 });
  }

  if (!process.env.OPENAI_API_KEY) {
    if (!isQuestionGrounded(parsed.question, stop, hotspot)) {
      return Response.json(refusal(parsed.language, "out-of-scope"), {
        headers: { "cache-control": "no-store" },
      });
    }
    return Response.json(verifiedFallback(parsed.language, parsed.stopId, parsed.hotspotId), {
      headers: { "cache-control": "no-store" },
    });
  }

  const sourceContext = hotspot.sourceIds.map((id) => {
    const source = getSource(id);
    return source ? { id: source.id, title: source.title, institution: source.institution, url: source.url, rights: source.rights } : null;
  }).filter(Boolean);
  const approvedContext = {
    stop: { id: stop.id, location: stop.location, title: stop.title, description: stop.description },
    record: { id: hotspot.id, label: hotspot.label, story: hotspot.story, facts: hotspot.facts, sourceIds: hotspot.sourceIds },
    sources: sourceContext,
  };

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.parse({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      store: false,
      reasoning: { effort: "low" },
      input: [
        {
          role: "system",
          content: `You are the source-bounded conductor of a Vietnamese living-heritage experience. Answer in ${parsed.language === "vi" ? "Vietnamese" : "English"}. Use only the APPROVED_CONTEXT supplied by the application. Do not add dates, techniques, legends, symbolism, quotations, instrument details, rituals, community claims, or pronunciation that are absent from the context. Keep the answer under 90 words. If the question cannot be answered completely from the context, set grounded=false, use no source IDs, and politely say the archive lacks sufficient evidence. If grounded=true, cite only IDs that occur in APPROVED_CONTEXT.record.sourceIds. Never imply that AI is an artisan or community authority.`,
        },
        {
          role: "user",
          content: `APPROVED_CONTEXT:\n${JSON.stringify(approvedContext)}\n\nQUESTION:\n${parsed.question}`,
        },
      ],
      text: { format: zodTextFormat(responseSchema, "heritage_guide_answer") },
    });

    const output = response.output_parsed;
    if (!output || !output.grounded) return Response.json(refusal(parsed.language, output?.refusalReason ?? "insufficient-source"));
    const allowed = new Set(hotspot.sourceIds);
    if (output.sourceIds.length === 0 || output.sourceIds.some((id) => !allowed.has(id))) {
      return Response.json(refusal(parsed.language, "invalid-citation"));
    }

    const result: GuideResponse = { ...output, mode: "ai" };
    return Response.json(result, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json(verifiedFallback(parsed.language, parsed.stopId, parsed.hotspotId), {
      headers: { "cache-control": "no-store" },
    });
  }
}
