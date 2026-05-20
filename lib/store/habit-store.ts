import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Habit, HabitCompletion, HabitWithStats } from "@/types";
import { generateId } from "@/lib/utils";
import { format, differenceInCalendarDays, subDays } from "date-fns";

interface HabitState {
  habits: Habit[];
  completions: HabitCompletion[];
  addHabit: (name: string, icon: string, color: string) => string;
  removeHabit: (id: string) => void;
  toggleHabit: (habitId: string, date?: string) => boolean;
  isHabitCompletedOn: (habitId: string, date: string) => boolean;
  getHabitStreak: (habitId: string) => number;
  getLongestStreak: (habitId: string) => number;
  getHabitsWithStats: (date?: string) => HabitWithStats[];
  getTodayCompletionRate: () => number;
  getCompletionDates: () => string[];
}

function getToday(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [
        {
          id: "default-1",
          name: "Wake up at 6 AM",
          icon: "⏰",
          color: "emerald",
          createdAt: new Date().toISOString(),
          archived: false,
        },
        {
          id: "default-2",
          name: "Gym session",
          icon: "💪",
          color: "orange",
          createdAt: new Date().toISOString(),
          archived: false,
        },
        {
          id: "default-3",
          name: "Study 4 hours",
          icon: "📚",
          color: "blue",
          createdAt: new Date().toISOString(),
          archived: false,
        },
        {
          id: "default-4",
          name: "No junk food",
          icon: "🥗",
          color: "emerald",
          createdAt: new Date().toISOString(),
          archived: false,
        },
        {
          id: "default-5",
          name: "Read 20 pages",
          icon: "📖",
          color: "violet",
          createdAt: new Date().toISOString(),
          archived: false,
        },
        {
          id: "default-6",
          name: "Solve 2 DSA problems",
          icon: "🧠",
          color: "blue",
          createdAt: new Date().toISOString(),
          archived: false,
        },
        {
          id: "default-7",
          name: "Drink 8 glasses of water",
          icon: "💧",
          color: "blue",
          createdAt: new Date().toISOString(),
          archived: false,
        },
      ],
      completions: [],

      addHabit: (name, icon, color) => {
        const id = generateId();
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id,
              name,
              icon,
              color,
              createdAt: new Date().toISOString(),
              archived: false,
            },
          ],
        }));
        return id;
      },

      removeHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          completions: state.completions.filter((c) => c.habitId !== id),
        }));
      },

      toggleHabit: (habitId, date) => {
        const targetDate = date || getToday();
        const isCompleted = get().isHabitCompletedOn(habitId, targetDate);

        if (isCompleted) {
          set((state) => ({
            completions: state.completions.filter(
              (c) => !(c.habitId === habitId && c.date === targetDate)
            ),
          }));
          return false;
        } else {
          set((state) => ({
            completions: [
              ...state.completions,
              {
                habitId,
                date: targetDate,
                completedAt: new Date().toISOString(),
              },
            ],
          }));
          return true;
        }
      },

      isHabitCompletedOn: (habitId, date) => {
        return get().completions.some(
          (c) => c.habitId === habitId && c.date === date
        );
      },

      getHabitStreak: (habitId) => {
        const completions = get().completions
          .filter((c) => c.habitId === habitId)
          .map((c) => c.date)
          .sort()
          .reverse();

        if (completions.length === 0) return 0;

        const today = getToday();
        let streak = 0;
        let checkDate = today;

        // If today isn't completed, start from yesterday
        if (!completions.includes(today)) {
          checkDate = format(subDays(new Date(), 1), "yyyy-MM-dd");
          if (!completions.includes(checkDate)) return 0;
        }

        while (completions.includes(checkDate)) {
          streak++;
          checkDate = format(
            subDays(new Date(checkDate + "T00:00:00"), 1),
            "yyyy-MM-dd"
          );
        }

        return streak;
      },

      getLongestStreak: (habitId) => {
        const completionDates = get()
          .completions.filter((c) => c.habitId === habitId)
          .map((c) => c.date)
          .sort();

        if (completionDates.length === 0) return 0;

        let longest = 1;
        let current = 1;

        for (let i = 1; i < completionDates.length; i++) {
          const diff = differenceInCalendarDays(
            new Date(completionDates[i] + "T00:00:00"),
            new Date(completionDates[i - 1] + "T00:00:00")
          );
          if (diff === 1) {
            current++;
            longest = Math.max(longest, current);
          } else if (diff > 1) {
            current = 1;
          }
        }

        return longest;
      },

      getHabitsWithStats: (date) => {
        const targetDate = date || getToday();
        const { habits, isHabitCompletedOn, getHabitStreak, getLongestStreak, completions } =
          get();

        return habits
          .filter((h) => !h.archived)
          .map((habit) => ({
            ...habit,
            completedToday: isHabitCompletedOn(habit.id, targetDate),
            currentStreak: getHabitStreak(habit.id),
            longestStreak: getLongestStreak(habit.id),
            totalCompletions: completions.filter(
              (c) => c.habitId === habit.id
            ).length,
          }));
      },

      getTodayCompletionRate: () => {
        const today = getToday();
        const activeHabits = get().habits.filter((h) => !h.archived);
        if (activeHabits.length === 0) return 0;
        const completed = activeHabits.filter((h) =>
          get().isHabitCompletedOn(h.id, today)
        ).length;
        return (completed / activeHabits.length) * 100;
      },

      getCompletionDates: () => {
        return [...new Set(get().completions.map((c) => c.date))];
      },
    }),
    {
      name: "forge-habits",
    }
  )
);
