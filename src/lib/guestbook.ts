import { createClient, type RealtimeChannel, type SupabaseClient } from "@supabase/supabase-js";

export interface GuestbookEntry {
  id: string;
  name: string;
  character: string;
  characterName: string;
  countryCode: string;
  countryName: string;
  flag: string;
  content: string;
  timestamp: string;
  createdAt?: string;
  legacyId?: string | null;
}

export interface AvatarOption {
  id: string;
  icon: string;
  labelVi: string;
  labelEn: string;
}

export const AVATAR_CATEGORIES: { categoryVi: string; categoryEn: string; avatars: AvatarOption[] }[] = [
  {
    categoryVi: "Văn hóa & Cổ phục",
    categoryEn: "Culture & Costumes",
    avatars: [
      { id: "female_ao_dai", icon: "👩‍🌾", labelVi: "Thiếu nữ Áo tứ thân", labelEn: "Quan Ho Maiden" },
      { id: "male_quan_ho", icon: "👨‍🌾", labelVi: "Liền anh Quan họ", labelEn: "Quan Ho Brother" },
      { id: "cham_dancer", icon: "💃", labelVi: "Vũ nữ Chăm Pa / Apsara", labelEn: "Cham Apsara Dancer" },
      { id: "nhat_binh", icon: "👘", labelVi: "Cổ phục Nhật Bình", labelEn: "Heritage Royal Attire" },
      { id: "mountain_folk", icon: "🧕", labelVi: "Đồng bào Dân tộc miền núi", labelEn: "Highland Folk" },
    ],
  },
  {
    categoryVi: "Nghệ nhân & Bác Trưởng tàu",
    categoryEn: "Artisans & Conductor",
    avatars: [
      { id: "conductor", icon: "👨‍✈️", labelVi: "Bác Trưởng tàu Di sản", labelEn: "Heritage Conductor" },
      { id: "musician", icon: "🧓", labelVi: "Bác Nghệ nhân Đờn ca", labelEn: "Master Musician" },
      { id: "calligrapher", icon: "👴", labelVi: "Cụ đồ Thư pháp", labelEn: "Calligraphy Master" },
      { id: "potter", icon: "🧑‍🎨", labelVi: "Nghệ nhân Gốm Bàu Trúc", labelEn: "Cham Pottery Artisan" },
      { id: "farmer", icon: "🌾", labelVi: "Lão nông Tri kỷ", labelEn: "Countryside Elder" },
    ],
  },
  {
    categoryVi: "Lữ khách & Thế hệ trẻ",
    categoryEn: "Travelers & Youth",
    avatars: [
      { id: "male_student", icon: "🧑‍🎓", labelVi: "Sinh viên / Nhà nghiên cứu", labelEn: "Student / Explorer" },
      { id: "traveler", icon: "🎒", labelVi: "Du khách Ba lô", labelEn: "Backpacker" },
      { id: "photographer", icon: "📷", labelVi: "Nhiếp ảnh gia Di sản", labelEn: "Heritage Photographer" },
      { id: "biker", icon: "🚴", labelVi: "Phượt thủ Xuyên Việt", labelEn: "Cross-Vietnam Biker" },
      { id: "artist", icon: "🎨", labelVi: "Họa sĩ Ký họa", labelEn: "Sketch Artist" },
      { id: "bard", icon: "🎸", labelVi: "Nhạc công Du ca", labelEn: "Roaming Minstrel" },
    ],
  },
  {
    categoryVi: "Biểu tượng & Tinh hoa Di sản",
    categoryEn: "Heritage Icons & Symbols",
    avatars: [
      { id: "lantern", icon: "🏮", labelVi: "Đèn lồng Phố Hội", labelEn: "Hoi An Lantern" },
      { id: "lotus", icon: "🪷", labelVi: "Hoa sen Đồng Tháp", labelEn: "Lotus Flower" },
      { id: "train", icon: "🚂", labelVi: "Đoàn tàu Di sản", labelEn: "Heritage Express" },
      { id: "lute", icon: "🪕", labelVi: "Cây Đàn Nguyệt", labelEn: "Moon Lute" },
      { id: "tea", icon: "🍵", labelVi: "Tách trà sen Tây Hồ", labelEn: "Lotus Tea" },
      { id: "coffee", icon: "☕", labelVi: "Cà phê Phin Việt Nam", labelEn: "Viet Drip Coffee" },
      { id: "vase", icon: "🏺", labelVi: "Bình gốm Cổ truyền", labelEn: "Heritage Ceramic" },
      { id: "bamboo", icon: "🎋", labelVi: "Lũy tre xanh", labelEn: "Green Bamboo" },
      { id: "dove", icon: "🕊️", labelVi: "Sứ giả Hoà bình", labelEn: "Dove of Peace" },
      { id: "star", icon: "🌟", labelVi: "Ngôi sao May mắn", labelEn: "Bright Star" },
      { id: "globe", icon: "🌏", labelVi: "Bạn bè Quốc tế", labelEn: "Global Passenger" },
      { id: "heart", icon: "❤️", labelVi: "Trái tim Đồng hành", labelEn: "Devoted Heart" },
    ],
  },
];

export const DEFAULT_AVATARS: AvatarOption[] = AVATAR_CATEGORIES.flatMap((cat) => cat.avatars);

export const NATIONALITIES = [
  { code: "VN", flag: "🇻🇳", nameVi: "Việt Nam", nameEn: "Vietnam" },
  { code: "JP", flag: "🇯🇵", nameVi: "Nhật Bản", nameEn: "Japan" },
  { code: "KR", flag: "🇰🇷", nameVi: "Hàn Quốc", nameEn: "Korea" },
  { code: "FR", flag: "🇫🇷", nameVi: "Pháp", nameEn: "France" },
  { code: "US", flag: "🇺🇸", nameVi: "Hoa Kỳ", nameEn: "United States" },
  { code: "UK", flag: "🇬🇧", nameVi: "Vương quốc Anh", nameEn: "United Kingdom" },
  { code: "DE", flag: "🇩🇪", nameVi: "Đức", nameEn: "Germany" },
  { code: "AU", flag: "🇦🇺", nameVi: "Úc", nameEn: "Australia" },
  { code: "OTHER", flag: "🌏", nameVi: "Quốc tế khác", nameEn: "International" },
];

export const QUICK_EMOJIS = ["🚂", "🏮", "🎶", "🇻🇳", "🪕", "🍵", "☕", "❤️", "✨", "👏", "📜", "🌸", "🪷", "🔥", "🏺", "🎫"];

type GuestbookRow = {
  id: string;
  legacy_id: string | null;
  name: string;
  character: string;
  character_name: string;
  country_code: string;
  country_name: string;
  flag: string;
  content: string;
  created_at: string;
};

export type NewGuestbookEntry = Omit<GuestbookEntry, "id" | "timestamp" | "createdAt">;

const LEGACY_STORAGE_KEY = "tau_di_san_guestbook";
const CACHE_STORAGE_KEY = "tau_di_san_guestbook_supabase_cache_v1";
const MIGRATION_STORAGE_PREFIX = "tau_di_san_guestbook_supabase_migrated_v2";
const LAST_SUBMIT_STORAGE_KEY = "tau_di_san_guestbook_last_submit";
const LOCAL_EVENT = "tau_di_san_guestbook_updated";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
let supabaseClient: SupabaseClient | null = null;

function hasRealSupabaseConfig() {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes("YOUR_PROJECT") &&
    !supabaseKey.includes("YOUR_SUPABASE"),
  );
}

function getSupabase(): SupabaseClient | null {
  if (!hasRealSupabaseConfig()) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl!, supabaseKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { params: { eventsPerSecond: 4 } },
    });
  }
  return supabaseClient;
}

function rowToEntry(row: GuestbookRow): GuestbookEntry {
  return {
    id: row.id,
    legacyId: row.legacy_id,
    name: row.name,
    character: row.character,
    characterName: row.character_name,
    countryCode: row.country_code,
    countryName: row.country_name,
    flag: row.flag,
    content: row.content,
    timestamp: "",
    createdAt: row.created_at,
  };
}

function entryToRow(entry: NewGuestbookEntry, legacyId: string | null = null, createdAt?: string) {
  return {
    legacy_id: legacyId,
    name: entry.name.trim().slice(0, 40),
    character: entry.character.slice(0, 16),
    character_name: entry.characterName.trim().slice(0, 80),
    country_code: entry.countryCode.trim().slice(0, 8),
    country_name: entry.countryName.trim().slice(0, 80),
    flag: entry.flag.slice(0, 16),
    content: entry.content.trim().slice(0, 260),
    ...(createdAt ? { created_at: createdAt } : {}),
  };
}

function emitLocalUpdate(entries: GuestbookEntry[]) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LOCAL_EVENT, { detail: entries }));
}

function writeCache(entries: GuestbookEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

export function getCachedGuestbook(): GuestbookEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
}

export function isGuestbookOnline() {
  return hasRealSupabaseConfig();
}

export async function listGuestbookEntries(): Promise<GuestbookEntry[]> {
  const client = getSupabase();
  if (!client) return getCachedGuestbook();

  const { data, error } = await client
    .from("guestbook_entries")
    .select("id, legacy_id, name, character, character_name, country_code, country_name, flag, content, created_at")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw error;
  const entries = ((data ?? []) as GuestbookRow[]).map(rowToEntry);
  writeCache(entries);
  return entries;
}

export async function createGuestbookEntry(entry: NewGuestbookEntry): Promise<GuestbookEntry> {
  if (typeof window !== "undefined") {
    const lastSubmit = Number(localStorage.getItem(LAST_SUBMIT_STORAGE_KEY) ?? 0);
    if (Date.now() - lastSubmit < 10_000) throw new Error("guestbook-rate-limit");
  }
  const client = getSupabase();
  if (!client) {
    const localEntry: GuestbookEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
      timestamp: "",
      createdAt: new Date().toISOString(),
    };
    const updated = [localEntry, ...getCachedGuestbook()];
    writeCache(updated);
    emitLocalUpdate(updated);
    localStorage.setItem(LAST_SUBMIT_STORAGE_KEY, String(Date.now()));
    return localEntry;
  }

  const { data, error } = await client
    .from("guestbook_entries")
    .insert(entryToRow(entry))
    .select("id, legacy_id, name, character, character_name, country_code, country_name, flag, content, created_at")
    .single();

  if (error) throw error;
  if (typeof window !== "undefined") {
    localStorage.setItem(LAST_SUBMIT_STORAGE_KEY, String(Date.now()));
  }
  return rowToEntry(data as GuestbookRow);
}

function legacyCreatedAt(id: string): string | undefined {
  const match = id.match(/(\d{13})$/);
  if (!match) return undefined;
  const value = Number(match[1]);
  return Number.isFinite(value) ? new Date(value).toISOString() : undefined;
}

function migrationStorageKey() {
  if (!supabaseUrl) return MIGRATION_STORAGE_PREFIX;
  try {
    const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
    return `${MIGRATION_STORAGE_PREFIX}:${projectRef}`;
  } catch {
    return MIGRATION_STORAGE_PREFIX;
  }
}

function readStoredEntries(storageKey: string): GuestbookEntry[] {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter(
          (entry): entry is GuestbookEntry =>
            Boolean(entry?.id) &&
            Boolean(entry?.content?.trim()) &&
            !String(entry.id).startsWith("seed-") &&
            !String(entry.legacyId ?? "").startsWith("seed-"),
        )
      : [];
  } catch {
    return [];
  }
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function migrateLegacyGuestbookEntries(): Promise<number> {
  const client = getSupabase();
  if (!client || typeof window === "undefined") return 0;
  const completedKey = migrationStorageKey();
  if (localStorage.getItem(completedKey) === "done") return 0;

  const storedEntries = [...readStoredEntries(CACHE_STORAGE_KEY), ...readStoredEntries(LEGACY_STORAGE_KEY)];
  const uniqueEntries = Array.from(
    new Map(storedEntries.map((entry) => [entry.legacyId ?? entry.id, entry])).values(),
  );
  const cachedRows = uniqueEntries
    .filter((entry) => UUID_PATTERN.test(entry.id))
    .map((entry) => ({
      id: entry.id,
      ...entryToRow(entry, entry.legacyId ?? `cache-${entry.id}`, entry.createdAt),
    }));
  const legacyRows = uniqueEntries
    .filter((entry) => !UUID_PATTERN.test(entry.id))
    .map((entry) => entryToRow(entry, entry.legacyId ?? entry.id, entry.createdAt ?? legacyCreatedAt(entry.id)));

  if (cachedRows.length > 0) {
    const { error } = await client
      .from("guestbook_entries")
      .upsert(cachedRows, { onConflict: "id", ignoreDuplicates: true });
    if (error) throw error;
  }
  if (legacyRows.length > 0) {
    const { error } = await client
      .from("guestbook_entries")
      .upsert(legacyRows, { onConflict: "legacy_id", ignoreDuplicates: true });
    if (error) throw error;
  }

  localStorage.setItem(completedKey, "done");
  return uniqueEntries.length;
}

export function formatGuestbookTimestamp(entry: GuestbookEntry, language: "vi" | "en") {
  if (!entry.createdAt) return entry.timestamp;
  const elapsed = Math.max(0, Date.now() - new Date(entry.createdAt).getTime());
  const minutes = Math.floor(elapsed / 60_000);
  const hours = Math.floor(elapsed / 3_600_000);
  const days = Math.floor(elapsed / 86_400_000);
  if (minutes < 1) return language === "vi" ? "Vừa xong" : "Just now";
  if (minutes < 60) return language === "vi" ? `${minutes} phút trước` : `${minutes}m ago`;
  if (hours < 24) return language === "vi" ? `${hours} giờ trước` : `${hours}h ago`;
  return language === "vi" ? `${days} ngày trước` : `${days}d ago`;
}

export function subscribeGuestbook(callback: (entries: GuestbookEntry[]) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const client = getSupabase();
  if (!client) {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<GuestbookEntry[]>).detail;
      callback(detail ?? getCachedGuestbook());
    };
    window.addEventListener(LOCAL_EVENT, handler);
    return () => window.removeEventListener(LOCAL_EVENT, handler);
  }

  let active = true;
  let channel: RealtimeChannel | null = client
    .channel("public-guestbook")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "guestbook_entries" },
      async () => {
        if (!active) return;
        try {
          callback(await listGuestbookEntries());
        } catch {}
      },
    )
    .subscribe();

  return () => {
    active = false;
    if (channel) void client.removeChannel(channel);
    channel = null;
  };
}
