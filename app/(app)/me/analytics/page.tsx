"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, ArrowLeft, TrendingUp, Clock, Flame, Target, Code2, Scale } from "lucide-react";
import { cn, calcProgress, formatDuration } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useHabitStore } from "@/lib/store/habit-store";
import { useBulkStore } from "@/lib/store/bulk-store";
import { useStudyStore } from "@/lib/store/study-store";
import { useUserStore } from "@/lib/store/user-store";
import { ProgressRing } from "@/components/progress/progress-ring";
import { StatBlock } from "@/components/cards/stat-block";
import { Heatmap } from "@/components/widgets/heatmap";
import { TopBar } from "@/components/navigation/top-bar";
import Link from "next/link";

export default function AnalyticsPage() {
  const profile = useUserStore((s) => s.profile);

  // Select raw state for reactivity
  const habits = useHabitStore((s) => s.habits);
  const completionsRaw = useHabitStore((s) => s.completions);
  const sessions = useStudyStore((s) => s.sessions);
  const dsaProblems = useStudyStore((s) => s.dsaProblems);
  const weightEntries = useBulkStore((s) => s.weightEntries);

  // Compute derived values with useMemo
  const habitsWithStats = useMemo(() => useHabitStore.getState().getHabitsWithStats(), [habits, completionsRaw]);
  const completionRate = useMemo(() => useHabitStore.getState().getTodayCompletionRate(), [habits, completionsRaw]);
  const completionDates = useMemo(() => useHabitStore.getState().getCompletionDates(), [completionsRaw]);
  const totalHours = useMemo(() => useStudyStore.getState().getTotalStudyHours(), [sessions]);
  const dsaSolved = useMemo(() => useStudyStore.getState().getSolvedCount(), [dsaProblems]);
  const dsaByDiff = useMemo(() => useStudyStore.getState().getSolvedByDifficulty(), [dsaProblems]);
  const weightTrend = useMemo(() => useBulkStore.getState().getWeightTrend(30), [weightEntries]);
  const latestWeight = useMemo(() => useBulkStore.getState().getLatestWeight(), [weightEntries]);

  const bestStreak = Math.max(...habitsWithStats.map((h) => h.longestStreak), 0);
  const totalCompletions = habitsWithStats.reduce((sum, h) => sum + h.totalCompletions, 0);

  // Calculate consistency score (simplified)
  const consistencyScore = habitsWithStats.length > 0
    ? Math.round(
        habitsWithStats.reduce((sum, h) => {
          const rate = h.totalCompletions > 0 ? Math.min(h.currentStreak / 7, 1) : 0;
          return sum + rate;
        }, 0) / habitsWithStats.length * 100
      )
    : 0;

  // Weight change
  const weightChange = weightTrend.length >= 2
    ? (weightTrend[weightTrend.length - 1].weight - weightTrend[0].weight).toFixed(1)
    : null;

  return (
    <div className="min-h-dvh">
      <TopBar
        title="Analytics"
        leftElement={
          <Link href="/me" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft size={20} />
          </Link>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-4 py-5 space-y-5 lg:px-8 lg:max-w-4xl"
      >
        {/* ── Discipline Score ── */}
        <motion.div variants={staggerItem}>
          <div className="flex flex-col items-center py-6 rounded-2xl bg-bg-surface border border-border-subtle">
            <ProgressRing
              progress={consistencyScore}
              size={140}
              strokeWidth={10}
              color="violet"
              label={`${consistencyScore}%`}
              sublabel="Discipline Score"
            />
            <p className="text-xs text-text-secondary mt-3">
              Based on current streak consistency
            </p>
          </div>
        </motion.div>

        {/* ── Overview Stats ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Overview</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <StatBlock icon={<Target size={18} />} label="Habit Completions" value={totalCompletions} color="emerald" />
            <StatBlock icon={<Flame size={18} />} label="Longest Streak" value={`${bestStreak} days`} color="amber" />
            <StatBlock icon={<Clock size={18} />} label="Study Hours" value={`${totalHours}h`} color="blue" />
            <StatBlock icon={<Code2 size={18} />} label="DSA Solved" value={dsaSolved} color="violet" />
          </div>
        </motion.div>

        {/* ── Body Analytics ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Body Progress</SectionTitle>
          <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-secondary">Current Weight</p>
                <p className="text-xl font-bold font-mono text-text-primary">
                  {latestWeight ? `${latestWeight.weight} kg` : "—"}
                </p>
              </div>
              {weightChange && (
                <div className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold",
                  parseFloat(weightChange) > 0
                    ? "bg-accent-emerald-dim text-accent-emerald"
                    : "bg-accent-rose-dim text-accent-rose"
                )}>
                  {parseFloat(weightChange) > 0 ? "+" : ""}{weightChange} kg
                </div>
              )}
            </div>
            {weightTrend.length > 1 && (
              <div className="flex items-end gap-1 h-16">
                {weightTrend.slice(-14).map((w, i) => {
                  const min = Math.min(...weightTrend.map((w) => w.weight));
                  const max = Math.max(...weightTrend.map((w) => w.weight));
                  const range = max - min || 1;
                  const height = ((w.weight - min) / range) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm gradient-orange opacity-70 hover:opacity-100 transition-opacity"
                      style={{ height: `${Math.max(height, 10)}%` }}
                      title={`${w.date}: ${w.weight} kg`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── DSA Breakdown ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>DSA Breakdown</SectionTitle>
          <div className="flex items-center justify-around py-5 rounded-2xl bg-bg-surface border border-border-subtle">
            <DifficultyCircle label="Easy" count={dsaByDiff.Easy} color="emerald" total={dsaSolved} />
            <DifficultyCircle label="Medium" count={dsaByDiff.Medium} color="amber" total={dsaSolved} />
            <DifficultyCircle label="Hard" count={dsaByDiff.Hard} color="rose" total={dsaSolved} />
          </div>
        </motion.div>

        {/* ── Consistency Heatmap ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Habit Consistency</SectionTitle>
          <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle overflow-x-auto">
            <Heatmap dates={completionDates} weeks={20} showMonths showDays />
          </div>
        </motion.div>

        {/* ── XP History ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Recent XP</SectionTitle>
          <div className="space-y-1.5">
            {profile.xpEvents.slice(-8).reverse().map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-bg-surface"
              >
                <span className="text-xs text-text-secondary truncate">{event.reason}</span>
                <span className="text-xs font-mono font-semibold text-accent-violet shrink-0 ml-2">
                  +{event.amount} XP
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function DifficultyCircle({
  label,
  count,
  color,
  total,
}: {
  label: string;
  count: number;
  color: "emerald" | "amber" | "rose";
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="text-center">
      <ProgressRing progress={pct} size={60} strokeWidth={5} color={color} label={`${count}`} />
      <p className={cn("text-[10px] font-medium mt-1", {
        "text-accent-emerald": color === "emerald",
        "text-accent-amber": color === "amber",
        "text-accent-rose": color === "rose",
      })}>{label}</p>
    </div>
  );
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2", className)}>
      {children}
    </h2>
  );
}
