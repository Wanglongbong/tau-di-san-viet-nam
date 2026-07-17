import assert from "node:assert/strict";
import test from "node:test";
import { approvedSourceIds, sources, stops } from "../lib/heritage.ts";

test("all cultural records are sourced and offer three grounded prompts", () => {
  assert.equal(stops.length, 5);
  assert.equal(stops.flatMap((stop) => stop.hotspots).length, 15);

  for (const stop of stops) {
    assert.ok(stop.sourceIds.length > 0, `${stop.id} must name a source`);
    assert.ok(stop.sourceIds.every((id) => approvedSourceIds.has(id)), `${stop.id} uses only approved sources`);
    for (const hotspot of stop.hotspots) {
      assert.equal(hotspot.suggestedQuestions.length, 3, `${stop.id}/${hotspot.id} must have three prompts`);
      assert.ok(hotspot.sourceIds.length > 0, `${stop.id}/${hotspot.id} must name a source`);
      assert.ok(hotspot.sourceIds.every((id) => approvedSourceIds.has(id)), `${stop.id}/${hotspot.id} uses only approved sources`);
      for (const prompt of hotspot.suggestedQuestions) {
        assert.ok(prompt.vi.trim().length > 10);
        assert.ok(prompt.en.trim().length > 10);
      }
    }
  }
});

test("every audio asset carries rights metadata and never extracts YouTube", () => {
  const assets = stops.flatMap((stop) => [
    stop.soundscape,
    ...stop.hotspots.flatMap((hotspot) => hotspot.audioPreview ? [hotspot.audioPreview] : []),
  ]);

  for (const asset of assets) {
    assert.ok(asset.id);
    assert.ok(asset.sourceUrl);
    assert.ok(asset.creator);
    assert.ok(asset.license);
    assert.ok(asset.credit.vi && asset.credit.en);
    assert.ok(asset.role);
    assert.ok(asset.reviewStatus);
    assert.ok(!/youtu(?:\.be|be\.com)/i.test(asset.sourceUrl), `${asset.id} must not use YouTube extraction`);

    if (asset.reviewStatus === "pending-rights" || asset.kind === "synthesized") {
      assert.equal(asset.src, null, `${asset.id} must not serve an unlicensed or synthesized recording`);
    }
    if (asset.kind === "synthesized") assert.ok(asset.generatorPreset, `${asset.id} needs a generator preset`);
  }
});

test("source records distinguish facts from media reuse rights", () => {
  assert.ok(sources.length >= 6);
  for (const source of sources) {
    assert.equal(source.status, "approved");
    assert.ok(source.reviewedBy);
    assert.ok(source.rights.vi && source.rights.en);
    assert.match(source.url, /^https:\/\//);
  }
});
