import { useCallback, useEffect, useState } from "react";
import {
  type GuestbookEntry,
  type NewGuestbookEntry,
  createGuestbookEntry,
  getCachedGuestbook,
  isGuestbookOnline,
  listGuestbookEntries,
  migrateLegacyGuestbookEntries,
  subscribeGuestbook,
} from "@/lib/guestbook";

export type GuestbookFeedStatus = "loading" | "online" | "offline" | "error";

export function useGuestbookFeed() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(() => getCachedGuestbook());
  const [status, setStatus] = useState<GuestbookFeedStatus>("loading");

  const refresh = useCallback(async () => {
    try {
      await migrateLegacyGuestbookEntries();
      const loaded = await listGuestbookEntries();
      setEntries(loaded);
      setStatus(isGuestbookOnline() ? "online" : "offline");
      return loaded;
    } catch (error) {
      setStatus("error");
      throw error;
    }
  }, []);

  useEffect(() => {
    let active = true;
    const unsubscribe = subscribeGuestbook((updated) => {
      if (!active) return;
      setEntries(updated);
      setStatus(isGuestbookOnline() ? "online" : "offline");
    });

    void refresh().catch(() => {});

    return () => {
      active = false;
      unsubscribe();
    };
  }, [refresh]);

  const addEntry = useCallback(async (entry: NewGuestbookEntry) => {
    const saved = await createGuestbookEntry(entry);
    setEntries((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
    setStatus(isGuestbookOnline() ? "online" : "offline");
    return saved;
  }, []);

  return { entries, status, addEntry, refresh };
}
