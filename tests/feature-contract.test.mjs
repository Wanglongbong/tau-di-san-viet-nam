import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("ships the carriage, grounded train artwork, voice routing, suggested questions and direct previews", async () => {
  const [ui, css, transcribe, landscape, carriage, train] = await Promise.all([
    readFile(new URL("components/heritage-game.tsx", projectRoot), "utf8"),
    readFile(new URL("app/globals.css", projectRoot), "utf8"),
    readFile(new URL("app/api/transcribe/route.ts", projectRoot), "utf8"),
    readFile(new URL("public/train/hai-van-journey.webp", projectRoot)),
    readFile(new URL("public/train/heritage-carriage.webp", projectRoot)),
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
  assert.match(ui, /\/train\/hai-van-journey\.webp/);
  assert.match(ui, /\/train\/heritage-carriage\.webp/);
  assert.match(ui, /\/train\/heritage-express\.webp/);
  assert.equal((ui.match(/\bunoptimized\b/g) || []).length, 5);
  assert.match(css, /\.pixel-conductor/);
  assert.match(css, /\.travel-train-image/);
  assert.match(css, /\.hotspot\.near/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /\.pixel-train-side/);
  assert.ok(landscape.byteLength > 200_000);
  assert.ok(carriage.byteLength > 200_000);
  assert.ok(train.byteLength > 300_000);

  assert.match(transcribe, /gpt-4o-mini-transcribe/);
  assert.match(transcribe, /MOCK_VOICE_API/);
  assert.match(transcribe, /mock: true/);
  assert.match(transcribe, /destinationId: "nha-nhac"/);
  assert.match(transcribe, /MAX_AUDIO_BYTES = 3 \* 1024 \* 1024/);
  assert.match(transcribe, /matchDestination\(transcript\)/);
  assert.doesNotMatch(`${ui}\n${transcribe}`, /youtube|youtu\.be/i);
});
