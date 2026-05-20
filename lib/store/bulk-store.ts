import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Meal, WeightEntry, Workout, WaterEntry } from "@/types";
import { generateId } from "@/lib/utils";
import { format } from "date-fns";

interface BulkState {
  meals: Meal[];
  weightEntries: WeightEntry[];
  workouts: Workout[];
  waterEntries: WaterEntry[];

  // Meal actions
  addMeal: (meal: Omit<Meal, "id" | "createdAt">) => void;
  removeMeal: (id: string) => void;
  getTodayMeals: () => Meal[];
  getTodayCalories: () => number;
  getTodayMacros: () => { protein: number; carbs: number; fats: number };

  // Weight actions
  addWeight: (weight: number, date?: string) => void;
  getLatestWeight: () => WeightEntry | null;
  getWeightTrend: (days: number) => WeightEntry[];

  // Water actions
  setWaterGlasses: (glasses: number, date?: string) => void;
  getTodayWater: () => number;

  // Workout actions
  addWorkout: (workout: Omit<Workout, "id" | "createdAt">) => void;
  getTodayWorkouts: () => Workout[];
}

function getToday(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export const useBulkStore = create<BulkState>()(
  persist(
    (set, get) => ({
      meals: [],
      weightEntries: [],
      workouts: [],
      waterEntries: [],

      addMeal: (meal) => {
        set((state) => ({
          meals: [
            ...state.meals,
            { ...meal, id: generateId(), createdAt: new Date().toISOString() },
          ],
        }));
      },

      removeMeal: (id) => {
        set((state) => ({
          meals: state.meals.filter((m) => m.id !== id),
        }));
      },

      getTodayMeals: () => {
        const today = getToday();
        return get().meals.filter((m) => m.date === today);
      },

      getTodayCalories: () => {
        return get()
          .getTodayMeals()
          .reduce((sum, m) => sum + m.calories, 0);
      },

      getTodayMacros: () => {
        const meals = get().getTodayMeals();
        return {
          protein: meals.reduce((sum, m) => sum + m.protein, 0),
          carbs: meals.reduce((sum, m) => sum + m.carbs, 0),
          fats: meals.reduce((sum, m) => sum + m.fats, 0),
        };
      },

      addWeight: (weight, date) => {
        const targetDate = date || getToday();
        // Remove existing entry for the same date
        set((state) => ({
          weightEntries: [
            ...state.weightEntries.filter((w) => w.date !== targetDate),
            {
              id: generateId(),
              date: targetDate,
              weight,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      getLatestWeight: () => {
        const entries = get().weightEntries.sort(
          (a, b) => b.date.localeCompare(a.date)
        );
        return entries[0] || null;
      },

      getWeightTrend: (days) => {
        const entries = get().weightEntries.sort(
          (a, b) => a.date.localeCompare(b.date)
        );
        return entries.slice(-days);
      },

      setWaterGlasses: (glasses, date) => {
        const targetDate = date || getToday();
        set((state) => ({
          waterEntries: [
            ...state.waterEntries.filter((w) => w.date !== targetDate),
            { date: targetDate, glasses },
          ],
        }));
      },

      getTodayWater: () => {
        const today = getToday();
        const entry = get().waterEntries.find((w) => w.date === today);
        return entry?.glasses || 0;
      },

      addWorkout: (workout) => {
        set((state) => ({
          workouts: [
            ...state.workouts,
            {
              ...workout,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      getTodayWorkouts: () => {
        const today = getToday();
        return get().workouts.filter((w) => w.date === today);
      },
    }),
    {
      name: "forge-bulk",
    }
  )
);
