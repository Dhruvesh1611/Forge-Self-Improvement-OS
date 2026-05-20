import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  UserProfile,
  XPEvent,
  UnlockedAchievement,
} from "@/types";
import { DEFAULT_GOALS } from "@/lib/constants";
import { generateId } from "@/lib/utils";

interface UserState {
  profile: UserProfile;
  addXP: (amount: number, reason: string, category: XPEvent["category"]) => void;
  unlockAchievement: (achievementId: string) => void;
  isAchievementUnlocked: (achievementId: string) => boolean;
  updateSettings: (settings: Partial<UserProfile["settings"]>) => void;
  updateName: (name: string) => void;
}

const defaultProfile: UserProfile = {
  name: "Dhruvesh",
  joinedAt: new Date().toISOString(),
  totalXP: 0,
  xpEvents: [],
  unlockedAchievements: [],
  settings: {
    dailyCalorieGoal: DEFAULT_GOALS.DAILY_CALORIES,
    dailyProteinGoal: DEFAULT_GOALS.DAILY_PROTEIN,
    dailyWaterGoal: DEFAULT_GOALS.DAILY_WATER_GLASSES,
    dailyStudyHoursGoal: DEFAULT_GOALS.DAILY_STUDY_HOURS,
    dailyDSAGoal: DEFAULT_GOALS.DAILY_DSA_PROBLEMS,
    pomodoroFocusDuration: 25,
    pomodoroBreakDuration: 5,
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,

      addXP: (amount, reason, category) => {
        const event: XPEvent = {
          id: generateId(),
          amount,
          reason,
          category,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          profile: {
            ...state.profile,
            totalXP: state.profile.totalXP + amount,
            xpEvents: [...state.profile.xpEvents, event],
          },
        }));
      },

      unlockAchievement: (achievementId) => {
        if (get().isAchievementUnlocked(achievementId)) return;
        const unlock: UnlockedAchievement = {
          achievementId,
          unlockedAt: new Date().toISOString(),
        };
        set((state) => ({
          profile: {
            ...state.profile,
            unlockedAchievements: [
              ...state.profile.unlockedAchievements,
              unlock,
            ],
          },
        }));
      },

      isAchievementUnlocked: (achievementId) => {
        return get().profile.unlockedAchievements.some(
          (a) => a.achievementId === achievementId
        );
      },

      updateSettings: (settings) => {
        set((state) => ({
          profile: {
            ...state.profile,
            settings: { ...state.profile.settings, ...settings },
          },
        }));
      },

      updateName: (name) => {
        set((state) => ({
          profile: { ...state.profile, name },
        }));
      },
    }),
    {
      name: "forge-user",
    }
  )
);
