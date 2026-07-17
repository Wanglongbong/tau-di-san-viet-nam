import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("ships the carriage, grounded train artwork, voice routing, suggested questions and direct previews", async () => {
  const [ui, css, transcribe, cover, landscape, track, carriage, conductor, train] = await Promise.all([
    readFile(new URL("components/heritage-game.tsx", projectRoot), "utf8"),
    readFile(new URL("app/globals.css", projectRoot), "utf8"),
    readFile(new URL("app/api/transcribe/route.ts", projectRoot), "utf8"),
    readFile(new URL("public/og.png", projectRoot)),
    readFile(new URL("public/train/coastal-transit-v2.webp", projectRoot)),
    readFile(new URL("public/train/straight-track-v2.png", projectRoot)),
    readFile(new URL("public/train/heritage-carriage.webp", projectRoot)),
    readFile(new URL("public/characters/ticket-conductor-v2.png", projectRoot)),
    readFile(new URL("public/train/heritage-express.webp", projectRoot)),
  ]);

  assert.match(ui, /"landing" \| "carriage" \| "travelling" \| "heritage"/);
  assert.match(ui, /new MediaRecorder/);
  assert.match(ui, /MAX_RECORDING_MS = 6_000/);
  assert.match(ui, /MAX_RECORDING_BYTES = 3 \* 1024 \* 1024/);
  assert.match(ui, /fetch\("\/api\/transcribe"/);
  assert.match(ui, /VOICE API · MÔ PHỎNG/);
  assert.match(ui, /mockedResult/);
  assert.match(ui, /fetch\("\/api\/guide"/);
  assert.match(ui, /sessionId/);
  assert.match(ui, /question-suggestions/);
  assert.match(ui, /new Audio\(preview\.src\)/);
  assert.match(ui, /preset !== "clay-work" && preset !== "open-fire"/);
  assert.match(ui, /\/og\.png/);
  assert.match(ui, /\/train\/coastal-transit-v2\.webp/);
  assert.match(ui, /\/train\/straight-track-v2\.png/);
  assert.match(ui, /\/train\/heritage-carriage\.webp/);
  assert.match(ui, /\/characters\/ticket-conductor-v2\.png/);
  assert.match(ui, /\/train\/heritage-express\.webp/);
  assert.ok((ui.match(/\bunoptimized\b/g) || []).length >= 7);
  assert.match(ui, /story-dialogue/);
  assert.match(ui, /story-mic-row/);
  assert.doesNotMatch(ui, /travel-rail-glow/);
  assert.match(css, /\.conductor-character/);
  assert.match(css, /\.travel-track-image/);
  assert.match(css, /\.travel-train-image/);
  assert.doesNotMatch(css, /\.pixel-conductor|\.travel-rail-glow/);
  assert.match(css, /\.hotspot\.near/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /\.pixel-train-side/);
  assert.ok(cover.byteLength > 500_000);
  assert.ok(landscape.byteLength > 250_000);
  assert.ok(track.byteLength > 250_000);
  assert.ok(carriage.byteLength > 200_000);
  assert.ok(conductor.byteLength > 500_000);
  assert.ok(train.byteLength > 300_000);

  assert.match(transcribe, /gpt-4o-mini-transcribe/);
  assert.match(transcribe, /MOCK_VOICE_API/);
  assert.match(transcribe, /mock: true/);
  assert.match(transcribe, /destinationId: "nha-nhac"/);
  assert.match(transcribe, /MAX_AUDIO_BYTES = 3 \* 1024 \* 1024/);
  assert.match(transcribe, /matchDestination\(transcript\)/);
  assert.doesNotMatch(`${ui}\n${transcribe}`, /youtube|youtu\.be/i);
});
