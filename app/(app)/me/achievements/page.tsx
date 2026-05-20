"use client";

import { motion } from "framer-motion";
import { Trophy, ArrowLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useUserStore } from "@/lib/store/user-store";
import { ACHIEVEMENTS } from "@/lib/constants";
import { TopBar } from "@/components/navigation/top-bar";
import Link from "next/link";
import { format } from "date-fns";

export default function AchievementsPage() {
  const profile = useUserStore((s) => s.profile);
  const isUnlocked = useUserStore((s) => s.isAchievementUnlocked);

  const unlocked = ACHIEVEMENTS.filter((a) => isUnlocked(a.id));
  const locked = ACHIEVEMENTS.filter((a) => !isUnlocked(a.id));

  return (
    <div className="min-h-dvh">
      <TopBar
        title="Achievements"
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
        {/* Summary */}
        <motion.div variants={staggerItem}>
          <div className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-bg-surface border border-border-subtle">
            <Trophy size={28} className="text-accent-amber" />
            <div>
              <p className="text-2xl font-bold font-mono text-text-primary">
                {unlocked.length}
                <span className="text-text-tertiary text-lg">/{ACHIEVEMENTS.length}</span>
              </p>
              <p className="text-xs text-text-secondary">Achievements Unlocked</p>
            </div>
          </div>
        </motion.div>

        {/* Unlocked */}
        {unlocked.length > 0 && (
          <motion.div variants={staggerItem}>
            <SectionTitle>Unlocked</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {unlocked.map((achievement) => {
                const unlockData = profile.unlockedAchievements.find(
                  (u) => u.achievementId === achievement.id
                );
                return (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ y: -1 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-bg-surface border border-accent-amber/20 glow-amber"
                  >
                    <span className="text-2xl shrink-0">{achievement.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary">
                        {achievement.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {achievement.description}
                      </p>
                      {unlockData && (
                        <p className="text-[10px] text-accent-amber mt-1 font-mono">
                          Unlocked {format(new Date(unlockData.unlockedAt), "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Locked */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Locked</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {locked.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-start gap-3 p-4 rounded-xl bg-bg-surface border border-border-subtle opacity-60"
              >
                <div className="relative shrink-0">
                  <span className="text-2xl grayscale">{achievement.icon}</span>
                  <Lock
                    size={10}
                    className="absolute -bottom-0.5 -right-0.5 text-text-tertiary"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-secondary">
                    {achievement.title}
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {achievement.condition}
                  </p>
                </div>
              </div>
            ))}
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
