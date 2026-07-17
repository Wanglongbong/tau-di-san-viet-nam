export type Language = "vi" | "en";

export type LocalizedText = {
  vi: string;
  en: string;
};

export type SourceRecord = {
  id: string;
  title: LocalizedText;
  institution: string;
  url: string;
  status: "approved" | "pending" | "restricted";
  reviewedBy: string;
  rights: LocalizedText;
  accessedAt: string;
};

export type AudioReviewStatus =
  | "approved-local"
  | "approved-original"
  | "pending-rights"
  | "restricted";

export type AudioRole =
  | "heritage-ensemble-excerpt"
  | "official-reference"
  | "modern-ambient"
  | "interpretive-foley";

/**
 * Rights metadata is deliberately required even when no file is served.
 * A null `src` means the source is reference-only or synthesized in-browser;
 * it must never be treated as permission to download or re-host a recording.
 */
export type AudioAsset = {
  id: string;
  kind: "local-audio" | "official-source" | "synthesized";
  src: string | null;
  sourceUrl: string;
  creator: string;
  license: string;
  licenseUrl?: string;
  credit: LocalizedText;
  role: AudioRole;
  reviewStatus: AudioReviewStatus;
  note: LocalizedText;
  durationSeconds?: number;
  bytes?: number;
  sha256?: string;
  technical?: string;
  generatorPreset?:
    | "carriage"
    | "kinh-bac-air"
    | "hanoi-room"
    | "hue-courtyard"
    | "cham-workyard"
    | "southern-riverside"
    | "clay-work"
    | "open-fire";
};

export type MediaAsset = {
  kind: "audio" | "official-link" | "animation";
  src?: string;
  sourceUrl?: string;
  creator?: string;
  license?: string;
  credit?: LocalizedText;
  role?: AudioRole;
  reviewStatus?: AudioReviewStatus;
};

export type Hotspot = {
  id: string;
  label: LocalizedText;
  kicker: LocalizedText;
  story: LocalizedText;
  facts: LocalizedText[];
  x: number;
  y: number;
  radius: number;
  interaction: "story" | "audio" | "animation";
  sourceIds: string[];
  media?: MediaAsset;
  audioPreview?: AudioAsset;
  suggestedQuestions: [LocalizedText, LocalizedText, LocalizedText];
};

export type HeritageStop = {
  id: string;
  number: string;
  location: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  scene: string;
  palette: string;
  sourceIds: string[];
  soundscape: AudioAsset;
  hotspots: Hotspot[];
};

export type GuideRequest = {
  sessionId: string;
  stopId: string;
  hotspotId: string;
  question: string;
  language: Language;
};

export type GuideResponse = {
  answer: string;
  sourceIds: string[];
  grounded: boolean;
  refusalReason: string | null;
  mode: "ai" | "verified-fallback" | "refusal";
};
