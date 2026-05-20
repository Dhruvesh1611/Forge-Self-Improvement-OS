"use client";

import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Plus, Flame } from "lucide-react";
import { cn, calcProgress } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useHabitStore } from "@/lib/store/habit-store";
import { useUserStore } from "@/lib/store/user-store";
import { ProgressBar } from "@/components/progress/progress-bar";
import { HabitCard } from "@/components/cards/habit-card";
import { HabitChain } from "@/components/widgets/habit-chain";
import { Heatmap } from "@/components/widgets/heatmap";
import { TopBar } from "@/components/navigation/top-bar";
import { emitXPGain } from "@/components/progress/xp-indicator";
import { useState } from "react";
import { format, subDays, startOfWeek, addDays } from "date-fns";

export default function HabitsPage() {
  const addXP = useUserStore((s) => s.addXP);

  // Select raw state for reactivity
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const toggleHabit = useHabitStore((s) => s.toggleHabit);
  const addHabit = useHabitStore((s) => s.addHabit);
  const isCompleted = useHabitStore((s) => s.isHabitCompletedOn);

  // Compute derived values with useMemo
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

  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("✅");

  const completedCount = habitsWithStats.filter((h) => h.completedToday).length;
  const totalCount = habitsWithStats.length;

  const handleToggle = useCallback(
    (id: string) => {
      const wasCompleted = toggleHabit(id);
      if (wasCompleted) {
        addXP(10, "Habit completed", "habit");
        emitXPGain(10, "Habit completed");

        const updatedHabits = useHabitStore.getState().getHabitsWithStats();
        const allDone = updatedHabits.every((h) => h.completedToday);
        if (allDone) {
          addXP(50, "All habits completed!", "bonus");
          emitXPGain(50, "All habits done! 🎉");
        }
      }
    },
    [toggleHabit, addXP]
  );

  const handleAddHabit = useCallback(() => {
    if (!newName.trim()) return;
    addHabit(newName.trim(), newIcon, "emerald");
    setNewName("");
    setNewIcon("✅");
    setShowForm(false);
  }, [newName, newIcon, addHabit]);

  // Build week view for habit chains
  const getWeekData = (habitId: string): boolean[] => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const date = format(addDays(weekStart, i), "yyyy-MM-dd");
      return isCompleted(habitId, date);
    });
  };

  const iconOptions = ["✅", "⏰", "💪", "📚", "🥗", "📖", "🧠", "💧", "🏃", "🧘", "💻", "🎯", "🌅", "✍️", "🎵"];

  return (
    <div className="min-h-dvh">
      <TopBar
        title="Habits"
        leftElement={<CheckCircle2 size={20} className="text-accent-emerald" />}
        rightElement={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-emerald/20 text-accent-emerald"
          >
            <Plus size={16} />
          </button>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-4 py-5 space-y-5 lg:px-8 lg:max-w-4xl"
      >
        {/* ── Progress Summary ── */}
        <motion.div variants={staggerItem}>
          <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">
                {completedCount}/{totalCount} completed
              </span>
              <span className="text-sm font-mono font-semibold text-accent-emerald">
                {Math.round(completionRate)}%
              </span>
            </div>
            <ProgressBar progress={completionRate} color="emerald" size="md" />
          </div>
        </motion.div>

        {/* ── New Habit Form ── */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 rounded-2xl bg-bg-surface border border-accent-emerald/20 space-y-3"
          >
            <input
              type="text"
              placeholder="Habit name (e.g., 'Meditate 10 min')"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-emerald focus:outline-none"
              autoFocus
            />
            <div>
              <p className="text-xs text-text-secondary mb-1.5">Choose icon</p>
              <div className="flex flex-wrap gap-1.5">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewIcon(icon)}
                    className={cn(
                      "w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all",
                      newIcon === icon
                        ? "bg-accent-emerald/20 ring-2 ring-accent-emerald"
                        : "bg-bg-elevated hover:bg-bg-hover"
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleAddHabit}
              className="w-full py-2.5 rounded-lg gradient-emerald text-sm font-semibold text-bg-root transition-opacity hover:opacity-90"
            >
              Create Habit
            </button>
          </motion.div>
        )}

        {/* ── Habit List ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Today</SectionTitle>
          <div className="space-y-2">
            {habitsWithStats.map((habit) => (
              <HabitCard
                key={habit.id}
                id={habit.id}
                name={habit.name}
                icon={habit.icon}
                streak={habit.currentStreak}
                completed={habit.completedToday}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </motion.div>

        {/* ── This Week ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>This Week</SectionTitle>
          <div className="space-y-3 p-4 rounded-2xl bg-bg-surface border border-border-subtle">
            {habitsWithStats.map((habit) => (
              <div key={habit.id} className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-24 truncate">
                  {habit.name}
                </span>
                <HabitChain days={getWeekData(habit.id)} color="emerald" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Streak Leaders ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Streak Leaders</SectionTitle>
          <div className="space-y-2">
            {habitsWithStats
              .filter((h) => h.currentStreak > 0)
              .sort((a, b) => b.currentStreak - a.currentStreak)
              .map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-border-subtle"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{habit.icon}</span>
                    <span className="text-sm font-medium text-text-primary">
                      {habit.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame
                      size={14}
                      className="text-accent-amber"
                      fill="currentColor"
                    />
                    <span className="text-sm font-mono font-bold text-accent-amber">
                      {habit.currentStreak}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>

        {/* ── Consistency Heatmap ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Consistency Map</SectionTitle>
          <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle overflow-x-auto">
            <Heatmap dates={completionDates} weeks={16} />
          </div>
        </motion.div>
      </motion.div>
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
