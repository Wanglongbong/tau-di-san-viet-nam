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

export type MediaAsset = {
  kind: "audio" | "official-link" | "animation";
  src?: string;
  sourceUrl?: string;
  creator?: string;
  license?: string;
  credit?: LocalizedText;
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
  hotspots: Hotspot[];
};

export type GuideRequest = {
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
