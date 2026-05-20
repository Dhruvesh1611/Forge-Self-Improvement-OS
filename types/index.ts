// ═══════════════════════════════════════════════
// FORGE — Type Definitions
// ═══════════════════════════════════════════════

// ──────────────────────────────────────────────
// Habit Types
// ──────────────────────────────────────────────

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
  archived: boolean;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
  completedAt: string; // ISO string
}

export interface HabitWithStats extends Habit {
  completedToday: boolean;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
}

// ──────────────────────────────────────────────
// Bulk / Fitness Types
// ──────────────────────────────────────────────

export interface Meal {
  id: string;
  date: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  category: "breakfast" | "lunch" | "dinner" | "snack" | "shake";
  createdAt: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number; // in kg
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

export interface ExerciseSet {
  reps: number;
  weight: number; // in kg
  rpe?: number; // 1-10
}

export interface Workout {
  id: string;
  date: string;
  name: string;
  exercises: Exercise[];
  duration: number; // minutes
  createdAt: string;
}

export interface WaterEntry {
  date: string;
  glasses: number;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  chest?: number;
  waist?: number;
  arms?: number;
  thighs?: number;
  createdAt: string;
}

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  meals: Meal[];
}

// ──────────────────────────────────────────────
// Study Types
// ──────────────────────────────────────────────

export interface StudySession {
  id: string;
  date: string;
  topic: string;
  duration: number; // minutes
  type: "focus" | "revision" | "practice";
  notes?: string;
  createdAt: string;
}

export interface DSAProblem {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  status: "solved" | "attempted" | "unsolved";
  notes?: string;
  url?: string;
  solvedAt?: string;
  createdAt: string;
}

export interface PomodoroSession {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration: number; // minutes
  completed: boolean;
  topic?: string;
}

// ──────────────────────────────────────────────
// Journal Types
// ──────────────────────────────────────────────

export interface JournalEntry {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  wins: string[];
  failures: string[];
  gratitude: string[];
  reflection: string;
  createdAt: string;
}

export interface WeeklyReview {
  id: string;
  weekStart: string; // YYYY-MM-DD (Monday)
  weekEnd: string;
  summary: string;
  moodAverage: number;
  totalWins: number;
  totalFailures: number;
  focusForNextWeek: string;
  createdAt: string;
}

// ──────────────────────────────────────────────
// Gamification Types
// ──────────────────────────────────────────────

export interface XPEvent {
  id: string;
  amount: number;
  reason: string;
  category: "habit" | "bulk" | "study" | "journal" | "streak" | "bonus";
  timestamp: string;
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: string;
}

export interface UserProfile {
  name: string;
  joinedAt: string;
  totalXP: number;
  xpEvents: XPEvent[];
  unlockedAchievements: UnlockedAchievement[];
  settings: UserSettings;
}

export interface UserSettings {
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyWaterGoal: number;
  dailyStudyHoursGoal: number;
  dailyDSAGoal: number;
  pomodoroFocusDuration: number;
  pomodoroBreakDuration: number;
}

// ──────────────────────────────────────────────
// Analytics Types
// ──────────────────────────────────────────────

export interface DailyStats {
  date: string;
  caloriesConsumed: number;
  calorieGoal: number;
  studyMinutes: number;
  studyGoal: number;
  habitsCompleted: number;
  habitsTotal: number;
  dsaProblemsSolved: number;
  waterGlasses: number;
  mood?: number;
  weight?: number;
}

export interface WeeklyStats {
  weekStart: string;
  avgCalories: number;
  totalStudyHours: number;
  avgHabitCompletion: number;
  dsaProblemsSolved: number;
  consistencyScore: number;
  weightChange: number;
}

// ──────────────────────────────────────────────
// UI Types
// ──────────────────────────────────────────────

export type AccentColor = "emerald" | "violet" | "blue" | "orange" | "rose" | "amber";

export interface NavItem {
  label: string;
  icon: string;
  href: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}
