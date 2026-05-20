import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JournalEntry } from "@/types";
import { generateId } from "@/lib/utils";
import { format } from "date-fns";

interface JournalState {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  removeEntry: (id: string) => void;
  getTodayEntry: () => JournalEntry | null;
  getRecentEntries: (count: number) => JournalEntry[];
  getMoodTrend: (days: number) => { date: string; mood: number }[];
}

function getToday(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        set((state) => ({
          entries: [
            ...state.entries,
            {
              ...entry,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }));
      },

      removeEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }));
      },

      getTodayEntry: () => {
        const today = getToday();
        return get().entries.find((e) => e.date === today) || null;
      },

      getRecentEntries: (count) => {
        return get()
          .entries.sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, count);
      },

      getMoodTrend: (days) => {
        return get()
          .entries.sort((a, b) => a.date.localeCompare(b.date))
          .slice(-days)
          .map((e) => ({ date: e.date, mood: e.mood }));
      },
    }),
    {
      name: "forge-journal",
    }
  )
);
