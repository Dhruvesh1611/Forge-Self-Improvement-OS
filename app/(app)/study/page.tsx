"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Plus,
  Code2,
  Timer,
  Clock,
} from "lucide-react";
import { cn, formatDuration, calcProgress } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useStudyStore } from "@/lib/store/study-store";
import { useUserStore } from "@/lib/store/user-store";
import { POMODORO, DSA_TOPICS, DSA_DIFFICULTIES } from "@/lib/constants";
import { ProgressRing } from "@/components/progress/progress-ring";
import { StatBlock } from "@/components/cards/stat-block";
import { TopBar } from "@/components/navigation/top-bar";
import { emitXPGain } from "@/components/progress/xp-indicator";
import { format } from "date-fns";

export default function StudyPage() {
  const profile = useUserStore((s) => s.profile);
  const addXP = useUserStore((s) => s.addXP);

  // Select raw state for reactivity
  const sessions = useStudyStore((s) => s.sessions);
  const dsaProblems = useStudyStore((s) => s.dsaProblems);
  const addSession = useStudyStore((s) => s.addSession);
  const addProblem = useStudyStore((s) => s.addProblem);

  // Compute derived values with useMemo
  const todaySessions = useMemo(() => useStudyStore.getState().getTodaySessions(), [sessions]);
  const todayStudyMin = useMemo(() => useStudyStore.getState().getTodayStudyMinutes(), [sessions]);
  const totalHours = useMemo(() => useStudyStore.getState().getTotalStudyHours(), [sessions]);
  const solvedCount = useMemo(() => useStudyStore.getState().getSolvedCount(), [dsaProblems]);
  const solvedByDiff = useMemo(() => useStudyStore.getState().getSolvedByDifficulty(), [dsaProblems]);
  const todayDSA = useMemo(() => useStudyStore.getState().getTodayDSASolved(), [dsaProblems]);

  const [activeTab, setActiveTab] = useState<"overview" | "timer" | "dsa">("overview");

  // Pomodoro state
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(POMODORO.FOCUS_DURATION);
  const [timerType, setTimerType] = useState<"focus" | "break">("focus");
  const [sessionCount, setSessionCount] = useState(0);
  const [timerTopic, setTimerTopic] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // DSA form
  const [showDSAForm, setShowDSAForm] = useState(false);
  const [dsaName, setDsaName] = useState("");
  const [dsaTopic, setDsaTopic] = useState<string>(DSA_TOPICS[0]);
  const [dsaDifficulty, setDsaDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");

  const { dailyStudyHoursGoal } = profile.settings;

  // Timer logic
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      // Timer complete
      if (timerType === "focus") {
        const newCount = sessionCount + 1;
        setSessionCount(newCount);
        addSession({
          date: format(new Date(), "yyyy-MM-dd"),
          topic: timerTopic || "Focus Session",
          duration: POMODORO.FOCUS_DURATION / 60,
          type: "focus",
        });
        addXP(15, "Pomodoro completed", "study");
        emitXPGain(15, "Focus session done!");

        // Switch to break
        const isLongBreak = newCount % POMODORO.SESSIONS_BEFORE_LONG_BREAK === 0;
        setTimerType("break");
        setTimerSeconds(isLongBreak ? POMODORO.LONG_BREAK : POMODORO.SHORT_BREAK);
      } else {
        setTimerType("focus");
        setTimerSeconds(POMODORO.FOCUS_DURATION);
      }
      setTimerActive(false);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerActive, timerSeconds, timerType, sessionCount, timerTopic, addSession, addXP]);

  const handleTimerToggle = () => setTimerActive(!timerActive);
  const handleTimerReset = () => {
    setTimerActive(false);
    setTimerSeconds(timerType === "focus" ? POMODORO.FOCUS_DURATION : POMODORO.SHORT_BREAK);
  };
  const handleTimerSkip = () => {
    setTimerActive(false);
    if (timerType === "focus") {
      setTimerType("break");
      setTimerSeconds(POMODORO.SHORT_BREAK);
    } else {
      setTimerType("focus");
      setTimerSeconds(POMODORO.FOCUS_DURATION);
    }
  };

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const timerTotal = timerType === "focus" ? POMODORO.FOCUS_DURATION : POMODORO.SHORT_BREAK;
  const timerProgress = ((timerTotal - timerSeconds) / timerTotal) * 100;

  const handleAddDSA = useCallback(() => {
    if (!dsaName) return;
    addProblem({
      name: dsaName,
      difficulty: dsaDifficulty,
      topic: dsaTopic,
      status: "solved",
      solvedAt: new Date().toISOString(),
    });
    const xpMap = { Easy: 10, Medium: 20, Hard: 40 };
    const xp = xpMap[dsaDifficulty];
    addXP(xp, `Solved ${dsaDifficulty} DSA`, "study");
    emitXPGain(xp, `${dsaDifficulty} problem solved!`);
    setDsaName("");
    setShowDSAForm(false);
  }, [dsaName, dsaDifficulty, dsaTopic, addProblem, addXP]);

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "timer" as const, label: "Timer" },
    { key: "dsa" as const, label: "DSA" },
  ];

  return (
    <div className="min-h-dvh">
      <TopBar
        title="Study"
        leftElement={<BookOpen size={20} className="text-accent-blue" />}
      />

      {/* Tabs */}
      <div className="px-4 pt-3 lg:px-8">
        <div className="flex gap-1 p-1 rounded-xl bg-bg-surface border border-border-subtle">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200",
                activeTab === tab.key
                  ? "bg-accent-blue text-bg-root"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="px-4 py-5 space-y-5 lg:px-8 lg:max-w-4xl"
      >
        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            <div className="flex flex-col items-center py-6 rounded-2xl bg-bg-surface border border-border-subtle">
              <ProgressRing
                progress={calcProgress(todayStudyMin, dailyStudyHoursGoal * 60)}
                size={120}
                strokeWidth={9}
                color="blue"
                label={formatDuration(todayStudyMin)}
                sublabel={`/ ${dailyStudyHoursGoal}h goal`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <StatBlock icon={<Clock size={18} />} label="Total Hours" value={`${totalHours}h`} color="blue" />
              <StatBlock icon={<Timer size={18} />} label="Sessions Today" value={todaySessions.length} color="violet" />
              <StatBlock icon={<Code2 size={18} />} label="DSA Solved" value={solvedCount} color="emerald" />
              <StatBlock icon={<Code2 size={18} />} label="DSA Today" value={todayDSA} color="amber" />
            </div>

            {todaySessions.length > 0 && (
              <div>
                <SectionTitle>Today&apos;s Sessions</SectionTitle>
                <div className="space-y-2">
                  {todaySessions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-border-subtle">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{s.topic}</p>
                        <p className="text-xs text-text-secondary capitalize">{s.type}</p>
                      </div>
                      <span className="text-sm font-mono font-semibold text-accent-blue">
                        {formatDuration(s.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── TIMER TAB ── */}
        {activeTab === "timer" && (
          <div className="flex flex-col items-center gap-6 py-8">
            {/* Topic input */}
            <input
              type="text"
              placeholder="What are you studying?"
              value={timerTopic}
              onChange={(e) => setTimerTopic(e.target.value)}
              className="w-full max-w-xs px-4 py-2.5 rounded-xl bg-bg-surface border border-border-subtle text-sm text-text-primary placeholder:text-text-tertiary text-center focus:border-accent-blue focus:outline-none"
            />

            {/* Timer type indicator */}
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold",
              timerType === "focus"
                ? "bg-accent-blue-dim text-accent-blue"
                : "bg-accent-emerald-dim text-accent-emerald"
            )}>
              {timerType === "focus" ? "Focus" : "Break"}
            </span>

            {/* Timer ring */}
            <div className="relative">
              <ProgressRing
                progress={timerProgress}
                size={200}
                strokeWidth={8}
                color={timerType === "focus" ? "blue" : "emerald"}
                label={formatTimer(timerSeconds)}
              />
            </div>

            {/* Session dots */}
            <div className="flex gap-2">
              {Array.from({ length: POMODORO.SESSIONS_BEFORE_LONG_BREAK }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors duration-300",
                    i < sessionCount % POMODORO.SESSIONS_BEFORE_LONG_BREAK
                      ? "bg-accent-blue"
                      : "bg-bg-elevated border border-border-subtle"
                  )}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleTimerReset}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary"
              >
                <RotateCcw size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleTimerToggle}
                className={cn(
                  "flex items-center justify-center w-16 h-16 rounded-full text-bg-root font-semibold",
                  timerType === "focus" ? "gradient-blue" : "gradient-emerald"
                )}
              >
                {timerActive ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleTimerSkip}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary"
              >
                <SkipForward size={18} />
              </motion.button>
            </div>
          </div>
        )}

        {/* ── DSA TAB ── */}
        {activeTab === "dsa" && (
          <>
            <div className="flex items-center justify-center gap-6 py-4 rounded-2xl bg-bg-surface border border-border-subtle">
              <div className="text-center">
                <p className="text-2xl font-bold font-mono text-accent-emerald">{solvedByDiff.Easy}</p>
                <p className="text-[10px] text-accent-emerald font-medium mt-0.5">Easy</p>
              </div>
              <div className="w-px h-10 bg-border-subtle" />
              <div className="text-center">
                <p className="text-2xl font-bold font-mono text-accent-amber">{solvedByDiff.Medium}</p>
                <p className="text-[10px] text-accent-amber font-medium mt-0.5">Medium</p>
              </div>
              <div className="w-px h-10 bg-border-subtle" />
              <div className="text-center">
                <p className="text-2xl font-bold font-mono text-accent-rose">{solvedByDiff.Hard}</p>
                <p className="text-[10px] text-accent-rose font-medium mt-0.5">Hard</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <SectionTitle className="mb-0">Problems</SectionTitle>
              <button
                onClick={() => setShowDSAForm(!showDSAForm)}
                className="flex items-center gap-1 text-xs text-accent-blue font-medium"
              >
                <Plus size={14} />
                Add Solved
              </button>
            </div>

            {showDSAForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 rounded-2xl bg-bg-surface border border-accent-blue/20 space-y-3"
              >
                <input
                  type="text"
                  placeholder="Problem name"
                  value={dsaName}
                  onChange={(e) => setDsaName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-blue focus:outline-none"
                />
                <div className="flex gap-1.5">
                  {DSA_DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDsaDifficulty(d)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                        dsaDifficulty === d
                          ? d === "Easy" ? "bg-accent-emerald text-bg-root"
                            : d === "Medium" ? "bg-accent-amber text-bg-root"
                            : "bg-accent-rose text-bg-root"
                          : "bg-bg-elevated text-text-secondary"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <select
                  value={dsaTopic}
                  onChange={(e) => setDsaTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary focus:border-accent-blue focus:outline-none"
                >
                  {DSA_TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddDSA}
                  className="w-full py-2.5 rounded-lg gradient-blue text-sm font-semibold text-bg-root"
                >
                  Mark as Solved
                </button>
              </motion.div>
            )}

            <StatBlock
              icon={<Code2 size={18} />}
              label="Total Solved"
              value={solvedCount}
              color="emerald"
            />
          </>
        )}
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
