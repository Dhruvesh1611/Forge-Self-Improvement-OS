"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  User,
  PenLine,
  BarChart3,
  Trophy,
  Settings,
  Calendar,
  Flame,
  Zap,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useUserStore } from "@/lib/store/user-store";
import { useHabitStore } from "@/lib/store/habit-store";
import { useStudyStore } from "@/lib/store/study-store";
import { getLevelProgress, ACHIEVEMENTS } from "@/lib/constants";
import { LevelBadge } from "@/components/progress/level-badge";
import { ProgressBar } from "@/components/progress/progress-bar";
import { StatBlock } from "@/components/cards/stat-block";
import { TopBar } from "@/components/navigation/top-bar";
import Link from "next/link";
import { differenceInCalendarDays } from "date-fns";

export default function MePage() {
  const profile = useUserStore((s) => s.profile);

  // Select raw state for reactivity
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const sessions = useStudyStore((s) => s.sessions);
  const dsaProblems = useStudyStore((s) => s.dsaProblems);

  // Compute derived values with useMemo
  const habitsWithStats = useMemo(
    () => useHabitStore.getState().getHabitsWithStats(),
    [habits, completions]
  );
  const totalHours = useMemo(() => useStudyStore.getState().getTotalStudyHours(), [sessions]);
  const dsaSolved = useMemo(() => useStudyStore.getState().getSolvedCount(), [dsaProblems]);

  const levelInfo = getLevelProgress(profile.totalXP);
  const unlockedCount = profile.unlockedAchievements.length;

  const daysActive = differenceInCalendarDays(new Date(), new Date(profile.joinedAt)) + 1;
  const bestStreak = Math.max(...habitsWithStats.map((h) => h.longestStreak), 0);

  const menuItems = [
    { label: "Journal", icon: PenLine, href: "/me/journal", color: "text-accent-violet" },
    { label: "Analytics", icon: BarChart3, href: "/me/analytics", color: "text-accent-blue" },
    { label: "Achievements", icon: Trophy, href: "/me/achievements", color: "text-accent-amber" },
    { label: "Settings", icon: Settings, href: "/me/settings", color: "text-text-secondary" },
  ];

  return (
    <div className="min-h-dvh">
      <TopBar title="Profile" leftElement={<User size={20} className="text-accent-violet" />} />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-4 py-5 space-y-5 lg:px-8 lg:max-w-4xl"
      >
        {/* ── Profile Card ── */}
        <motion.div variants={staggerItem}>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-bg-surface border border-border-subtle">
            {/* Avatar placeholder */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-violet to-accent-blue flex items-center justify-center mb-3">
              <span className="text-3xl font-bold text-white">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-text-primary">{profile.name}</h2>
            <p className="text-sm text-text-secondary mt-0.5">
              Lv. {levelInfo.current.level} — {levelInfo.current.title}
            </p>
            <div className="w-full max-w-[200px] mt-3">
              <ProgressBar progress={levelInfo.progress} color="violet" size="sm" />
              <p className="text-[10px] text-text-tertiary text-center mt-1 font-mono">
                {profile.totalXP.toLocaleString()} XP
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <motion.div variants={staggerItem}>
          <div className="grid grid-cols-2 gap-2">
            <StatBlock icon={<Calendar size={18} />} label="Days Active" value={daysActive} color="blue" />
            <StatBlock icon={<Flame size={18} />} label="Best Streak" value={`${bestStreak} days`} color="amber" />
            <StatBlock icon={<Star size={18} />} label="Achievements" value={`${unlockedCount}/${ACHIEVEMENTS.length}`} color="violet" />
            <StatBlock icon={<Zap size={18} />} label="Total XP" value={profile.totalXP.toLocaleString()} color="emerald" />
          </div>
        </motion.div>

        {/* ── Menu ── */}
        <motion.div variants={staggerItem}>
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-bg-surface border border-border-subtle hover:bg-bg-elevated transition-colors"
                  >
                    <Icon size={20} className={item.color} />
                    <span className="text-sm font-medium text-text-primary flex-1">
                      {item.label}
                    </span>
                    <span className="text-text-tertiary text-sm">→</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
