// ═══════════════════════════════════════════════
// FORGE — Constants & Configuration
// ═══════════════════════════════════════════════

// ──────────────────────────────────────────────
// XP System
// ──────────────────────────────────────────────

export const XP_REWARDS = {
  HABIT_COMPLETE: 10,
  ALL_HABITS_BONUS: 50,
  LOG_MEAL: 5,
  STUDY_SESSION: 15, // per 25-min pomodoro
  DSA_EASY: 10,
  DSA_MEDIUM: 20,
  DSA_HARD: 40,
  LOG_WEIGHT: 5,
  JOURNAL_ENTRY: 15,
  STREAK_7_DAY: 100,
  STREAK_30_DAY: 500,
  WORKOUT_COMPLETE: 20,
  WATER_GOAL: 5,
} as const;

// ──────────────────────────────────────────────
// Level System
// ──────────────────────────────────────────────

export interface Level {
  level: number;
  title: string;
  xpRequired: number;
  color: "gray" | "blue" | "emerald" | "violet" | "amber";
}

export const LEVELS: Level[] = [
  { level: 1, title: "Initiate", xpRequired: 0, color: "gray" },
  { level: 2, title: "Beginner", xpRequired: 200, color: "gray" },
  { level: 3, title: "Committed", xpRequired: 500, color: "blue" },
  { level: 4, title: "Focused", xpRequired: 1000, color: "blue" },
  { level: 5, title: "Consistent", xpRequired: 2000, color: "emerald" },
  { level: 6, title: "Driven", xpRequired: 3500, color: "emerald" },
  { level: 7, title: "Disciplined", xpRequired: 5500, color: "violet" },
  { level: 8, title: "Relentless", xpRequired: 8000, color: "violet" },
  { level: 9, title: "Elite", xpRequired: 12000, color: "amber" },
  { level: 10, title: "Legendary", xpRequired: 18000, color: "amber" },
];

/**
 * Get the current level based on total XP
 */
export function getLevelForXP(totalXP: number): Level {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (totalXP >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

/**
 * Get XP progress toward next level
 */
export function getLevelProgress(totalXP: number): {
  current: Level;
  next: Level | null;
  currentXP: number;
  requiredXP: number;
  progress: number;
} {
  const current = getLevelForXP(totalXP);
  const nextIndex = LEVELS.findIndex((l) => l.level === current.level) + 1;
  const next = nextIndex < LEVELS.length ? LEVELS[nextIndex] : null;

  if (!next) {
    return { current, next: null, currentXP: totalXP, requiredXP: 0, progress: 100 };
  }

  const currentXP = totalXP - current.xpRequired;
  const requiredXP = next.xpRequired - current.xpRequired;
  const progress = Math.min((currentXP / requiredXP) * 100, 100);

  return { current, next, currentXP, requiredXP, progress };
}

// ──────────────────────────────────────────────
// Achievements
// ──────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "habits" | "bulk" | "study" | "journal" | "general";
  condition: string; // Human-readable condition
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-blood",
    title: "First Blood",
    description: "Complete your first habit",
    icon: "⚔️",
    category: "habits",
    condition: "Complete 1 habit",
  },
  {
    id: "iron-will",
    title: "Iron Will",
    description: "Maintain a 7-day habit streak",
    icon: "🛡️",
    category: "habits",
    condition: "7-day streak",
  },
  {
    id: "unbreakable",
    title: "Unbreakable",
    description: "Maintain a 30-day habit streak",
    icon: "💎",
    category: "habits",
    condition: "30-day streak",
  },
  {
    id: "centurion",
    title: "Centurion",
    description: "Solve 100 DSA problems",
    icon: "🏛️",
    category: "study",
    condition: "100 DSA problems solved",
  },
  {
    id: "bulk-mode",
    title: "Bulk Mode",
    description: "Log meals for 30 consecutive days",
    icon: "🍖",
    category: "bulk",
    condition: "30-day meal logging streak",
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Accumulate 100 hours of study time",
    icon: "📜",
    category: "study",
    condition: "100 total study hours",
  },
  {
    id: "philosopher",
    title: "Philosopher",
    description: "Write 30 journal entries",
    icon: "🧠",
    category: "journal",
    condition: "30 journal entries",
  },
  {
    id: "apex-predator",
    title: "Apex Predator",
    description: "Reach Level 10 — Legendary",
    icon: "👑",
    category: "general",
    condition: "Reach Level 10",
  },
  {
    id: "consistency-king",
    title: "Consistency King",
    description: "Achieve a 90%+ consistency score for a full week",
    icon: "🏆",
    category: "general",
    condition: "90%+ weekly consistency",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Complete all habits before noon for 7 days",
    icon: "🌅",
    category: "habits",
    condition: "All habits done before 12 PM for 7 days",
  },
  {
    id: "iron-stomach",
    title: "Iron Stomach",
    description: "Hit your calorie goal for 14 consecutive days",
    icon: "💪",
    category: "bulk",
    condition: "14-day calorie goal streak",
  },
  {
    id: "deep-focus",
    title: "Deep Focus",
    description: "Complete 8 pomodoro sessions in a single day",
    icon: "🎯",
    category: "study",
    condition: "8 pomodoros in one day",
  },
];

// ──────────────────────────────────────────────
// Motivational Quotes
// ──────────────────────────────────────────────

export const QUOTES = [
  {
    text: "The pain you feel today is the strength you feel tomorrow.",
    author: "Arnold Schwarzenegger",
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Hard work beats talent when talent doesn't work hard.",
    author: "Tim Notke",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The body achieves what the mind believes.",
    author: "Napoleon Hill",
  },
  {
    text: "Every champion was once a contender that refused to give up.",
    author: "Rocky Balboa",
  },
  {
    text: "You don't have to be extreme, just consistent.",
    author: "Unknown",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "It's not about being the best. It's about being better than you were yesterday.",
    author: "Unknown",
  },
  {
    text: "Your future self is watching you right now through memories.",
    author: "Unknown",
  },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
  },
  {
    text: "The man who moves a mountain begins by carrying away small stones.",
    author: "Confucius",
  },
];

/**
 * Get today's quote (deterministic based on date)
 */
export function getTodaysQuote() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

// ──────────────────────────────────────────────
// Pomodoro Timer
// ──────────────────────────────────────────────

export const POMODORO = {
  FOCUS_DURATION: 25 * 60, // 25 minutes in seconds
  SHORT_BREAK: 5 * 60, // 5 minutes
  LONG_BREAK: 15 * 60, // 15 minutes
  SESSIONS_BEFORE_LONG_BREAK: 4,
} as const;

// ──────────────────────────────────────────────
// Default Goals
// ──────────────────────────────────────────────

export const DEFAULT_GOALS = {
  DAILY_CALORIES: 2800,
  DAILY_PROTEIN: 140, // grams
  DAILY_WATER_GLASSES: 8,
  DAILY_STUDY_HOURS: 4,
  DAILY_DSA_PROBLEMS: 2,
} as const;

// ──────────────────────────────────────────────
// Mood System
// ──────────────────────────────────────────────

export const MOODS = [
  { value: 1, emoji: "😤", label: "Frustrated" },
  { value: 2, emoji: "😔", label: "Down" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
] as const;

// ──────────────────────────────────────────────
// Navigation
// ──────────────────────────────────────────────

export const NAV_ITEMS = [
  { label: "Home", icon: "Home", href: "/" },
  { label: "Bulk", icon: "Dumbbell", href: "/bulk" },
  { label: "Study", icon: "BookOpen", href: "/study" },
  { label: "Habits", icon: "CheckCircle", href: "/habits" },
  { label: "Me", icon: "User", href: "/me" },
] as const;

// ──────────────────────────────────────────────
// DSA Topics
// ──────────────────────────────────────────────

export const DSA_TOPICS = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Stacks & Queues",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Greedy",
  "Binary Search",
  "Backtracking",
  "Sorting",
  "Hashing",
  "Heaps",
  "Sliding Window",
  "Two Pointers",
  "Recursion",
  "Bit Manipulation",
  "Math",
] as const;

export const DSA_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
