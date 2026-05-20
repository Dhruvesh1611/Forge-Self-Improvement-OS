"use client";

import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Utensils,
  BookOpen,
  Dumbbell,
  PenLine,
  Target,
  Droplets,
  Code2,
  TrendingUp,
} from "lucide-react";
import { cn, getGreeting, formatDuration, calcProgress } from "@/lib/utils";
import { getTodaysQuote, getLevelProgress } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useUserStore } from "@/lib/store/user-store";
import { useHabitStore } from "@/lib/store/habit-store";
import { useBulkStore } from "@/lib/store/bulk-store";
import { useStudyStore } from "@/lib/store/study-store";
import { ProgressRing } from "@/components/progress/progress-ring";
import { ProgressBar } from "@/components/progress/progress-bar";
import { LevelBadge } from "@/components/progress/level-badge";
import { QuoteCard } from "@/components/cards/quote-card";
import { StatBlock } from "@/components/cards/stat-block";
import { HabitCard } from "@/components/cards/habit-card";
import { StreakWidget } from "@/components/widgets/streak-widget";
import { Heatmap } from "@/components/widgets/heatmap";
import { emitXPGain } from "@/components/progress/xp-indicator";
import Link from "next/link";

export default function DashboardPage() {
  const profile = useUserStore((s) => s.profile);
  const addXP = useUserStore((s) => s.addXP);

  // Select raw state for reactivity; compute derived values with useMemo
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const toggleHabit = useHabitStore((s) => s.toggleHabit);

  const habitsWithStats = useMemo(
    () => useHabitStore.getState().getHabitsWithStats(),
    [habits, completions]
  );
  const completionRate = useMemo(
    () => useHabitStore.getState().getTodayCompletionRate(),
    [habits, completions]
  );
  const completionDates = useMemo(
    () => useHabitStore.getState().getCompletionDates(),
    [completions]
  );

  const meals = useBulkStore((s) => s.meals);
  const waterEntries = useBulkStore((s) => s.waterEntries);
  const weightEntries = useBulkStore((s) => s.weightEntries);

  const todayCalories = useMemo(() => useBulkStore.getState().getTodayCalories(), [meals]);
  const todayWater = useMemo(() => useBulkStore.getState().getTodayWater(), [waterEntries]);
  const latestWeight = useMemo(() => useBulkStore.getState().getLatestWeight(), [weightEntries]);

  const sessions = useStudyStore((s) => s.sessions);
  const dsaProblems = useStudyStore((s) => s.dsaProblems);

  const todayStudyMin = useMemo(() => useStudyStore.getState().getTodayStudyMinutes(), [sessions]);
  const todayDSA = useMemo(() => useStudyStore.getState().getTodayDSASolved(), [dsaProblems]);
  const totalDSA = useMemo(() => useStudyStore.getState().getSolvedCount(), [dsaProblems]);

  const quote = getTodaysQuote();
  const levelInfo = getLevelProgress(profile.totalXP);

  const completedHabits = habitsWithStats.filter((h) => h.completedToday).length;
  const totalHabits = habitsWithStats.length;

  // Find best streaks for display
  const topStreaks = habitsWithStats
    .filter((h) => h.currentStreak > 0)
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .slice(0, 4);

  const handleToggleHabit = useCallback(
    (id: string) => {
      const wasCompleted = toggleHabit(id);
      if (wasCompleted) {
        addXP(10, "Habit completed", "habit");
        emitXPGain(10, "Habit completed");

        // Check if all habits done
        const updatedHabits = useHabitStore.getState().getHabitsWithStats();
        const allDone = updatedHabits.every((h) => h.completedToday);
        if (allDone) {
          addXP(50, "All habits completed!", "bonus");
          emitXPGain(50, "All habits completed!");
        }
      }
    },
    [toggleHabit, addXP]
  );

  return (
    <div className="min-h-dvh">
      {/* ── Header ── */}
      <header className="px-4 pt-6 pb-2 lg:px-8 lg:pt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">
              {getGreeting()},
            </p>
            <h1 className="text-2xl font-bold text-text-primary mt-0.5">
              {profile.name} 🔥
            </h1>
          </div>
          <LevelBadge totalXP={profile.totalXP} size="sm" />
        </div>
      </header>

      {/* ── Content ── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-4 pb-8 space-y-5 lg:px-8 lg:max-w-4xl"
      >
        {/* Quote */}
        <motion.div variants={staggerItem}>
          <QuoteCard text={quote.text} author={quote.author} />
        </motion.div>

        {/* ── Today's Progress Rings ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Today&apos;s Progress</SectionTitle>
          <div className="flex items-center justify-around py-4 px-2 rounded-2xl bg-bg-surface border border-border-subtle">
            <ProgressRing
              progress={calcProgress(todayCalories, profile.settings.dailyCalorieGoal)}
              size={90}
              strokeWidth={7}
              color="orange"
              label={todayCalories.toLocaleString()}
              sublabel="Calories"
            />
            <ProgressRing
              progress={calcProgress(
                todayStudyMin,
                profile.settings.dailyStudyHoursGoal * 60
              )}
              size={90}
              strokeWidth={7}
              color="blue"
              label={formatDuration(todayStudyMin)}
              sublabel="Study"
            />
            <ProgressRing
              progress={completionRate}
              size={90}
              strokeWidth={7}
              color="emerald"
              label={`${completedHabits}/${totalHabits}`}
              sublabel="Habits"
            />
          </div>
        </motion.div>

        {/* ── Streaks ── */}
        {topStreaks.length > 0 && (
          <motion.div variants={staggerItem}>
            <SectionTitle>Active Streaks</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {topStreaks.map((h) => (
                <StreakWidget
                  key={h.id}
                  label={h.name}
                  days={h.currentStreak}
                  isActive={h.completedToday}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Quick Actions ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Quick Actions</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <QuickAction
              href="/bulk"
              icon={<Utensils size={18} />}
              label="Log Meal"
              color="orange"
            />
            <QuickAction
              href="/study"
              icon={<BookOpen size={18} />}
              label="Start Study"
              color="blue"
            />
            <QuickAction
              href="/habits"
              icon={<Target size={18} />}
              label="View Habits"
              color="emerald"
            />
            <QuickAction
              href="/me/journal"
              icon={<PenLine size={18} />}
              label="Journal"
              color="violet"
            />
          </div>
        </motion.div>

        {/* ── Level & XP ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Level Progress</SectionTitle>
          <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle">
            <div className="flex items-center gap-4 mb-3">
              <LevelBadge totalXP={profile.totalXP} size="md" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Lv. {levelInfo.current.level} — {levelInfo.current.title}
                </p>
                {levelInfo.next && (
                  <p className="text-xs text-text-secondary mt-0.5">
                    {levelInfo.currentXP.toLocaleString()} / {levelInfo.requiredXP.toLocaleString()} XP to{" "}
                    {levelInfo.next.title}
                  </p>
                )}
              </div>
            </div>
            <ProgressBar
              progress={levelInfo.progress}
              color="violet"
              size="md"
            />
          </div>
        </motion.div>

        {/* ── Today's Habits ── */}
        <motion.div variants={staggerItem}>
          <div className="flex items-center justify-between mb-2">
            <SectionTitle className="mb-0">Today&apos;s Habits</SectionTitle>
            <Link
              href="/habits"
              className="text-xs text-accent-violet font-medium hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {habitsWithStats.slice(0, 5).map((habit) => (
              <HabitCard
                key={habit.id}
                id={habit.id}
                name={habit.name}
                icon={habit.icon}
                streak={habit.currentStreak}
                completed={habit.completedToday}
                onToggle={handleToggleHabit}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Consistency Heatmap ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Consistency</SectionTitle>
          <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle overflow-x-auto">
            <Heatmap dates={completionDates} weeks={12} />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-text-secondary">
                Last 12 weeks
              </span>
              <span className="text-sm font-mono font-semibold text-accent-emerald">
                {Math.round(completionRate)}% today
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Stats ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Quick Stats</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <StatBlock
              icon={<Dumbbell size={18} />}
              label="Current Weight"
              value={latestWeight ? `${latestWeight.weight} kg` : "—"}
              color="orange"
            />
            <StatBlock
              icon={<Droplets size={18} />}
              label="Water Today"
              value={`${todayWater}/${profile.settings.dailyWaterGoal} glasses`}
              color="blue"
            />
            <StatBlock
              icon={<Code2 size={18} />}
              label="DSA Solved"
              value={`${todayDSA} today / ${totalDSA} total`}
              color="violet"
            />
            <StatBlock
              icon={<TrendingUp size={18} />}
              label="Total XP"
              value={profile.totalXP.toLocaleString()}
              color="amber"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Helper Components ──

function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2",
        className
      )}
    >
      {children}
    </h2>
  );
}

function QuickAction({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: "emerald" | "violet" | "blue" | "orange";
}) {
  const bgMap = {
    emerald: "bg-accent-emerald-dim hover:bg-accent-emerald/20",
    violet: "bg-accent-violet-dim hover:bg-accent-violet/20",
    blue: "bg-accent-blue-dim hover:bg-accent-blue/20",
    orange: "bg-accent-orange-dim hover:bg-accent-orange/20",
  };

  const textMap = {
    emerald: "text-accent-emerald",
    violet: "text-accent-violet",
    blue: "text-accent-blue",
    orange: "text-accent-orange",
  };

  return (
    <Link href={href}>
      <motion.div
        whileTap={{ scale: 0.97 }}
        className={cn(
          "flex items-center gap-2.5 px-4 py-3 rounded-xl",
          "border border-border-subtle transition-colors duration-200",
          bgMap[color]
        )}
      >
        <div className={textMap[color]}>{icon}</div>
        <span className="text-sm font-medium text-text-primary">{label}</span>
      </motion.div>
    </Link>
  );
}
