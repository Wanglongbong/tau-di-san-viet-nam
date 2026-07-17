import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("ships the carriage, voice routing, suggested questions and direct previews", async () => {
  const [ui, css, transcribe] = await Promise.all([
    readFile(new URL("components/heritage-game.tsx", projectRoot), "utf8"),
    readFile(new URL("app/globals.css", projectRoot), "utf8"),
    readFile(new URL("app/api/transcribe/route.ts", projectRoot), "utf8"),
  ]);

  assert.match(ui, /"landing" \| "carriage" \| "travelling" \| "heritage"/);
  assert.match(ui, /new MediaRecorder/);
  assert.match(ui, /MAX_RECORDING_MS = 6_000/);
  assert.match(ui, /MAX_RECORDING_BYTES = 3 \* 1024 \* 1024/);
  assert.match(ui, /fetch\("\/api\/transcribe"/);
  assert.match(ui, /fetch\("\/api\/guide"/);
  assert.match(ui, /sessionId/);
  assert.match(ui, /question-suggestions/);
  assert.match(ui, /new Audio\(preview\.src\)/);
  assert.match(ui, /preset !== "clay-work" && preset !== "open-fire"/);
  assert.match(css, /\.pixel-conductor/);
  assert.match(css, /\.hotspot\.near/);
  assert.match(css, /prefers-reduced-motion/);

  assert.match(transcribe, /gpt-4o-mini-transcribe/);
  assert.match(transcribe, /MAX_AUDIO_BYTES = 3 \* 1024 \* 1024/);
  assert.match(transcribe, /matchDestination\(transcript\)/);
  assert.doesNotMatch(`${ui}\n${transcribe}`, /youtube|youtu\.be/i);
});
