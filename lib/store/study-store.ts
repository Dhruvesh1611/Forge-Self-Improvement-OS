import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudySession, DSAProblem } from "@/types";
import { generateId } from "@/lib/utils";
import { format } from "date-fns";

interface StudyState {
  sessions: StudySession[];
  dsaProblems: DSAProblem[];

  // Session actions
  addSession: (session: Omit<StudySession, "id" | "createdAt">) => void;
  getTodaySessions: () => StudySession[];
  getTodayStudyMinutes: () => number;
  getTotalStudyHours: () => number;

  // DSA actions
  addProblem: (problem: Omit<DSAProblem, "id" | "createdAt">) => void;
  updateProblemStatus: (id: string, status: DSAProblem["status"]) => void;
  removeProblem: (id: string) => void;
  getSolvedCount: () => number;
  getSolvedByDifficulty: () => { Easy: number; Medium: number; Hard: number };
  getSolvedByTopic: () => Record<string, number>;
  getTodayDSASolved: () => number;
}

function getToday(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      sessions: [],
      dsaProblems: [],

      addSession: (session) => {
        set((state) => ({
          sessions: [
            ...state.sessions,
            {
              ...session,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      getTodaySessions: () => {
        const today = getToday();
        return get().sessions.filter((s) => s.date === today);
      },

      getTodayStudyMinutes: () => {
        return get()
          .getTodaySessions()
          .reduce((sum, s) => sum + s.duration, 0);
      },

      getTotalStudyHours: () => {
        const totalMinutes = get().sessions.reduce(
          (sum, s) => sum + s.duration,
          0
        );
        return Math.round((totalMinutes / 60) * 10) / 10;
      },

      addProblem: (problem) => {
        set((state) => ({
          dsaProblems: [
            ...state.dsaProblems,
            {
              ...problem,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      updateProblemStatus: (id, status) => {
        set((state) => ({
          dsaProblems: state.dsaProblems.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status,
                  solvedAt:
                    status === "solved"
                      ? new Date().toISOString()
                      : p.solvedAt,
                }
              : p
          ),
        }));
      },

      removeProblem: (id) => {
        set((state) => ({
          dsaProblems: state.dsaProblems.filter((p) => p.id !== id),
        }));
      },

      getSolvedCount: () => {
        return get().dsaProblems.filter((p) => p.status === "solved").length;
      },

      getSolvedByDifficulty: () => {
        const solved = get().dsaProblems.filter((p) => p.status === "solved");
        return {
          Easy: solved.filter((p) => p.difficulty === "Easy").length,
          Medium: solved.filter((p) => p.difficulty === "Medium").length,
          Hard: solved.filter((p) => p.difficulty === "Hard").length,
        };
      },

      getSolvedByTopic: () => {
        const solved = get().dsaProblems.filter((p) => p.status === "solved");
        const byTopic: Record<string, number> = {};
        solved.forEach((p) => {
          byTopic[p.topic] = (byTopic[p.topic] || 0) + 1;
        });
        return byTopic;
      },

      getTodayDSASolved: () => {
        const today = getToday();
        return get().dsaProblems.filter(
          (p) =>
            p.status === "solved" &&
            p.solvedAt &&
            format(new Date(p.solvedAt), "yyyy-MM-dd") === today
        ).length;
      },
    }),
    {
      name: "forge-study",
    }
  )
);
