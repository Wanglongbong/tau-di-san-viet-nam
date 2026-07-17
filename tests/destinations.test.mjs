import assert from "node:assert/strict";
import test from "node:test";
import { matchDestination, normalizeDestinationSpeech } from "../lib/destinations.ts";
import { takeRateLimit } from "../lib/server/rate-limit.ts";
import { parseSessionId } from "../lib/server/session.ts";

test("normalizes Vietnamese destination speech", () => {
  assert.equal(normalizeDestinationSpeech("  Tôi muốn đến ĐỜN CA TÀI TỬ!  "), " toi muon den don ca tai tu ");
});

test("matches aliases for all five destinations", () => {
  assert.deepEqual(matchDestination("Cho tôi đến Bắc Ninh"), { status: "matched", destinationId: "quan-ho" });
  assert.deepEqual(matchDestination("Tôi muốn đi Hà Nội"), { status: "matched", destinationId: "ca-tru" });
  assert.deepEqual(matchDestination("Đưa tôi tới Huế"), { status: "matched", destinationId: "nha-nhac" });
  assert.deepEqual(matchDestination("Ghé làng gốm Bàu Trúc"), { status: "matched", destinationId: "cham-pottery" });
  assert.deepEqual(matchDestination("Tôi chọn Sài Gòn"), { status: "matched", destinationId: "don-ca-tai-tu" });
  assert.deepEqual(matchDestination("Đi Thành phố Hồ Chí Minh"), { status: "matched", destinationId: "don-ca-tai-tu" });
  assert.deepEqual(matchDestination("Take me to Hanoi"), { status: "matched", destinationId: "ca-tru" });
  assert.deepEqual(matchDestination("I choose Southern Vietnam"), { status: "matched", destinationId: "don-ca-tai-tu" });
});

test("returns no-match for speech without a supported destination", () => {
  assert.deepEqual(matchDestination("Hôm nay trời đẹp quá"), { status: "no-match", destinationId: null });
});

test("returns ambiguous when more than one destination is named", () => {
  assert.deepEqual(matchDestination("Hà Nội hay Huế đều được"), { status: "ambiguous", destinationId: null });
  assert.deepEqual(matchDestination("Từ Bắc Ninh vào Sài Gòn"), { status: "ambiguous", destinationId: null });
});

test("validates privacy-safe session identifiers", () => {
  assert.equal(parseSessionId("12345678-1234-4123-8123-123456789abc"), "12345678-1234-4123-8123-123456789abc");
  assert.equal(parseSessionId("short"), null);
  assert.equal(parseSessionId("123456789012345 invalid"), null);
  assert.equal(parseSessionId("x".repeat(65)), null);
});

test("applies independent fixed-window limits by session", () => {
  const firstSession = "test-session-rate-limit-one";
  const secondSession = "test-session-rate-limit-two";
  const now = 10_000;

  assert.equal(takeRateLimit("guide", firstSession, 2, now).allowed, true);
  assert.equal(takeRateLimit("guide", firstSession, 2, now + 1).allowed, true);
  assert.equal(takeRateLimit("guide", firstSession, 2, now + 2).allowed, false);
  assert.equal(takeRateLimit("guide", secondSession, 2, now + 2).allowed, true);
  assert.equal(takeRateLimit("guide", firstSession, 2, now + 60_000).allowed, true);
});
