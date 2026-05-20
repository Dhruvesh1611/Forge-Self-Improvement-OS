"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { PenLine, Plus, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useJournalStore } from "@/lib/store/journal-store";
import { useUserStore } from "@/lib/store/user-store";
import { MOODS } from "@/lib/constants";
import { TopBar } from "@/components/navigation/top-bar";
import { emitXPGain } from "@/components/progress/xp-indicator";
import Link from "next/link";
import { format } from "date-fns";

export default function JournalPage() {
  const addXP = useUserStore((s) => s.addXP);

  // Select raw state for reactivity
  const entries = useJournalStore((s) => s.entries);
  const addEntry = useJournalStore((s) => s.addEntry);

  // Compute derived values with useMemo
  const recentEntries = useMemo(() => useJournalStore.getState().getRecentEntries(20), [entries]);
  const todayEntry = useMemo(() => useJournalStore.getState().getTodayEntry(), [entries]);

  const [showForm, setShowForm] = useState(false);
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [wins, setWins] = useState("");
  const [failures, setFailures] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [reflection, setReflection] = useState("");

  const handleSubmit = useCallback(() => {
    if (!reflection.trim() && !wins.trim()) return;
    addEntry({
      date: format(new Date(), "yyyy-MM-dd"),
      mood,
      wins: wins.split("\n").filter(Boolean),
      failures: failures.split("\n").filter(Boolean),
      gratitude: gratitude.split("\n").filter(Boolean),
      reflection: reflection.trim(),
    });
    addXP(15, "Journal entry", "journal");
    emitXPGain(15, "Journal entry! 📝");
    setShowForm(false);
    setMood(3);
    setWins("");
    setFailures("");
    setGratitude("");
    setReflection("");
  }, [mood, wins, failures, gratitude, reflection, addEntry, addXP]);

  const getMoodEmoji = (m: number) => MOODS.find((mood) => mood.value === m)?.emoji || "😐";

  return (
    <div className="min-h-dvh">
      <TopBar
        title="Journal"
        leftElement={
          <Link href="/me" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft size={20} />
          </Link>
        }
        rightElement={
          !todayEntry && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-violet/20 text-accent-violet"
            >
              <Plus size={16} />
            </button>
          )
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-4 py-5 space-y-5 lg:px-8 lg:max-w-4xl"
      >
        {/* ── New Entry Form ── */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-bg-surface border border-accent-violet/20 space-y-4"
          >
            {/* Mood selector */}
            <div>
              <p className="text-xs text-text-secondary mb-2 font-medium uppercase tracking-wider">
                How do you feel?
              </p>
              <div className="flex justify-around">
                {MOODS.map((m) => (
                  <motion.button
                    key={m.value}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMood(m.value as 1 | 2 | 3 | 4 | 5)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                      mood === m.value
                        ? "bg-accent-violet/20 scale-110"
                        : "opacity-50 hover:opacity-75"
                    )}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-[9px] text-text-secondary">{m.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Wins */}
            <div>
              <label className="text-xs text-accent-emerald font-medium uppercase tracking-wider">
                Wins 🏆
              </label>
              <textarea
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                placeholder="What went well? (one per line)"
                rows={2}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-emerald focus:outline-none resize-none"
              />
            </div>

            {/* Failures */}
            <div>
              <label className="text-xs text-accent-rose font-medium uppercase tracking-wider">
                Lessons 📝
              </label>
              <textarea
                value={failures}
                onChange={(e) => setFailures(e.target.value)}
                placeholder="What to improve? (one per line)"
                rows={2}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-rose focus:outline-none resize-none"
              />
            </div>

            {/* Gratitude */}
            <div>
              <label className="text-xs text-accent-amber font-medium uppercase tracking-wider">
                Gratitude ✨
              </label>
              <textarea
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="3 things you're grateful for"
                rows={2}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-amber focus:outline-none resize-none"
              />
            </div>

            {/* Reflection */}
            <div>
              <label className="text-xs text-accent-blue font-medium uppercase tracking-wider">
                Reflection 💭
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Free-form thoughts..."
                rows={3}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-blue focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-2.5 rounded-lg gradient-violet text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Save Entry
            </button>
          </motion.div>
        )}

        {/* ── Today's Entry ── */}
        {todayEntry && (
          <motion.div variants={staggerItem}>
            <SectionTitle>Today</SectionTitle>
            <JournalEntryCard entry={todayEntry} />
          </motion.div>
        )}

        {/* ── Recent Entries ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Recent Entries</SectionTitle>
          {recentEntries.length === 0 ? (
            <p className="text-sm text-text-tertiary py-6 text-center">
              No journal entries yet. Start reflecting! ✨
            </p>
          ) : (
            <div className="space-y-2">
              {recentEntries.map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

function JournalEntryCard({ entry }: { entry: import("@/types").JournalEntry }) {
  const getMoodEmoji = (m: number) => MOODS.find((mood) => mood.value === m)?.emoji || "😐";
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setExpanded(!expanded)}
      className="p-4 rounded-xl bg-bg-surface border border-border-subtle cursor-pointer hover:bg-bg-elevated transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
          <div>
            <p className="text-sm font-medium text-text-primary">
              {format(new Date(entry.date + "T00:00:00"), "MMM d, yyyy")}
            </p>
            <p className="text-xs text-text-secondary">
              {MOODS.find((m) => m.value === entry.mood)?.label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          {entry.wins.length > 0 && <span>🏆{entry.wins.length}</span>}
          {entry.gratitude.length > 0 && <span>✨{entry.gratitude.length}</span>}
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 pt-3 border-t border-border-subtle space-y-2"
        >
          {entry.wins.length > 0 && (
            <div>
              <p className="text-xs text-accent-emerald font-medium mb-1">Wins</p>
              {entry.wins.map((w, i) => (
                <p key={i} className="text-xs text-text-secondary">• {w}</p>
              ))}
            </div>
          )}
          {entry.failures.length > 0 && (
            <div>
              <p className="text-xs text-accent-rose font-medium mb-1">Lessons</p>
              {entry.failures.map((f, i) => (
                <p key={i} className="text-xs text-text-secondary">• {f}</p>
              ))}
            </div>
          )}
          {entry.gratitude.length > 0 && (
            <div>
              <p className="text-xs text-accent-amber font-medium mb-1">Gratitude</p>
              {entry.gratitude.map((g, i) => (
                <p key={i} className="text-xs text-text-secondary">• {g}</p>
              ))}
            </div>
          )}
          {entry.reflection && (
            <div>
              <p className="text-xs text-accent-blue font-medium mb-1">Reflection</p>
              <p className="text-xs text-text-secondary leading-relaxed">{entry.reflection}</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2", className)}>
      {children}
    </h2>
  );
}
