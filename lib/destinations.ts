export const DESTINATION_IDS = [
  "quan-ho",
  "ca-tru",
  "nha-nhac",
  "cham-pottery",
  "don-ca-tai-tu",
] as const;

export type DestinationId = (typeof DESTINATION_IDS)[number];
export type DestinationMatchStatus = "matched" | "ambiguous" | "no-match";

export type DestinationMatch = {
  status: DestinationMatchStatus;
  destinationId: DestinationId | null;
};

const destinationAliases: Readonly<Record<DestinationId, readonly string[]>> = {
  "quan-ho": ["quan ho", "kinh bac", "bac ninh", "bac giang"],
  "ca-tru": ["ca tru", "ha noi", "hanoi"],
  "nha-nhac": ["nha nhac", "co do hue", "thua thien hue", "hue"],
  "cham-pottery": [
    "gom cham",
    "lang gom cham",
    "cham pottery",
    "bau truc",
    "ninh thuan",
    "binh thuan",
  ],
  "don-ca-tai-tu": [
    "don ca tai tu",
    "tai tu nam bo",
    "thanh pho ho chi minh",
    "tp ho chi minh",
    "tp hcm",
    "ho chi minh",
    "sai gon",
    "saigon",
    "nam bo",
    "mien nam",
    "southern vietnam",
  ],
};

/**
 * Normalizes speech-transcription punctuation and Vietnamese diacritics while
 * preserving word boundaries. Destination matching stays deterministic: AI is
 * used only for transcription, never for deciding where the train should go.
 */
export function normalizeDestinationSpeech(value: string): string {
  return ` ${value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")} `;
}

function containsAlias(normalizedSpeech: string, alias: string): boolean {
  return normalizedSpeech.includes(` ${alias} `);
}

export function matchDestination(transcript: string): DestinationMatch {
  const normalizedSpeech = normalizeDestinationSpeech(transcript);
  const matches = DESTINATION_IDS.filter((destinationId) =>
    destinationAliases[destinationId].some((alias) => containsAlias(normalizedSpeech, alias)),
  );

  if (matches.length === 1) {
    return { status: "matched", destinationId: matches[0] };
  }

  if (matches.length > 1) {
    return { status: "ambiguous", destinationId: null };
  }

  return { status: "no-match", destinationId: null };
}
