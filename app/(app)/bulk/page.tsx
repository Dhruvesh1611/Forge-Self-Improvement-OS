"use client";

import { useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Plus,
  Utensils,
  Droplets,
  Dumbbell,
  Scale,
  TrendingUp,
} from "lucide-react";
import { cn, calcProgress } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useBulkStore } from "@/lib/store/bulk-store";
import { useUserStore } from "@/lib/store/user-store";
import { ProgressRing } from "@/components/progress/progress-ring";
import { ProgressBar } from "@/components/progress/progress-bar";
import { StatBlock } from "@/components/cards/stat-block";
import { emitXPGain } from "@/components/progress/xp-indicator";
import { TopBar } from "@/components/navigation/top-bar";

export default function BulkPage() {
  const profile = useUserStore((s) => s.profile);
  const addXP = useUserStore((s) => s.addXP);

  // Select raw state for reactivity
  const meals = useBulkStore((s) => s.meals);
  const waterEntries = useBulkStore((s) => s.waterEntries);
  const weightEntries = useBulkStore((s) => s.weightEntries);
  const setWater = useBulkStore((s) => s.setWaterGlasses);
  const addMeal = useBulkStore((s) => s.addMeal);
  const addWeight = useBulkStore((s) => s.addWeight);

  // Compute derived values with useMemo
  const todayCalories = useMemo(() => useBulkStore.getState().getTodayCalories(), [meals]);
  const todayMacros = useMemo(() => useBulkStore.getState().getTodayMacros(), [meals]);
  const todayMeals = useMemo(() => useBulkStore.getState().getTodayMeals(), [meals]);
  const todayWater = useMemo(() => useBulkStore.getState().getTodayWater(), [waterEntries]);
  const latestWeight = useMemo(() => useBulkStore.getState().getLatestWeight(), [weightEntries]);

  const [showMealForm, setShowMealForm] = useState(false);
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealCal, setMealCal] = useState("");
  const [mealProtein, setMealProtein] = useState("");
  const [mealCarbs, setMealCarbs] = useState("");
  const [mealFats, setMealFats] = useState("");
  const [mealCategory, setMealCategory] = useState<"breakfast" | "lunch" | "dinner" | "snack" | "shake">("lunch");
  const [weightInput, setWeightInput] = useState("");

  const { dailyCalorieGoal, dailyProteinGoal, dailyWaterGoal } = profile.settings;

  const handleAddMeal = useCallback(() => {
    if (!mealName || !mealCal) return;
    addMeal({
      date: format(new Date(), "yyyy-MM-dd"),
      name: mealName,
      calories: parseInt(mealCal) || 0,
      protein: parseInt(mealProtein) || 0,
      carbs: parseInt(mealCarbs) || 0,
      fats: parseInt(mealFats) || 0,
      category: mealCategory,
    });
    addXP(5, "Logged meal", "bulk");
    emitXPGain(5, "Logged meal");
    setMealName("");
    setMealCal("");
    setMealProtein("");
    setMealCarbs("");
    setMealFats("");
    setShowMealForm(false);
  }, [mealName, mealCal, mealProtein, mealCarbs, mealFats, mealCategory, addMeal, addXP]);

  const handleAddWeight = useCallback(() => {
    const w = parseFloat(weightInput);
    if (!w || w <= 0) return;
    addWeight(w);
    addXP(5, "Logged weight", "bulk");
    emitXPGain(5, "Logged weight");
    setWeightInput("");
    setShowWeightForm(false);
  }, [weightInput, addWeight, addXP]);

  const handleWaterTap = useCallback(() => {
    const newVal = todayWater >= dailyWaterGoal ? 0 : todayWater + 1;
    setWater(newVal);
    if (newVal === dailyWaterGoal) {
      addXP(5, "Water goal hit!", "bulk");
      emitXPGain(5, "Water goal hit!");
    }
  }, [todayWater, dailyWaterGoal, setWater, addXP]);

  return (
    <div className="min-h-dvh">
      <TopBar
        title="Bulk Tracker"
        leftElement={<Dumbbell size={20} className="text-accent-orange" />}
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-4 py-5 space-y-5 lg:px-8 lg:max-w-4xl"
      >
        {/* ── Calorie Ring ── */}
        <motion.div variants={staggerItem}>
          <div className="flex flex-col items-center py-6 rounded-2xl bg-bg-surface border border-border-subtle">
            <ProgressRing
              progress={calcProgress(todayCalories, dailyCalorieGoal)}
              size={140}
              strokeWidth={10}
              color="orange"
              label={todayCalories.toLocaleString()}
              sublabel={`/ ${dailyCalorieGoal.toLocaleString()} cal`}
            />
            {/* Macros */}
            <div className="flex items-center gap-6 mt-5">
              <MacroBar label="Protein" value={todayMacros.protein} goal={dailyProteinGoal} unit="g" color="blue" />
              <MacroBar label="Carbs" value={todayMacros.carbs} goal={350} unit="g" color="orange" />
              <MacroBar label="Fats" value={todayMacros.fats} goal={80} unit="g" color="amber" />
            </div>
          </div>
        </motion.div>

        {/* ── Water Tracker ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Water Intake</SectionTitle>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-bg-surface border border-border-subtle">
            <Droplets size={20} className="text-accent-blue shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: dailyWaterGoal }).map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={handleWaterTap}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "w-6 h-6 rounded-full transition-all duration-300 touch-target",
                      i < todayWater
                        ? "bg-accent-blue"
                        : "bg-bg-elevated border border-border-subtle"
                    )}
                    aria-label={`Glass ${i + 1}`}
                  />
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-1.5">
                {todayWater}/{dailyWaterGoal} glasses
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Meals ── */}
        <motion.div variants={staggerItem}>
          <div className="flex items-center justify-between mb-2">
            <SectionTitle className="mb-0">Today&apos;s Meals</SectionTitle>
            <button
              onClick={() => setShowMealForm(!showMealForm)}
              className="flex items-center gap-1 text-xs text-accent-orange font-medium"
            >
              <Plus size={14} />
              Add
            </button>
          </div>

          {/* Meal Form */}
          {showMealForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 mb-3 rounded-2xl bg-bg-surface border border-accent-orange/20 space-y-3"
            >
              <input
                type="text"
                placeholder="Meal name"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-orange focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Calories"
                  value={mealCal}
                  onChange={(e) => setMealCal(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-orange focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={mealProtein}
                  onChange={(e) => setMealProtein(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-orange focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={mealCarbs}
                  onChange={(e) => setMealCarbs(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-orange focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Fats (g)"
                  value={mealFats}
                  onChange={(e) => setMealFats(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-orange focus:outline-none"
                />
              </div>
              {/* Category selector */}
              <div className="flex gap-1.5 flex-wrap">
                {(["breakfast", "lunch", "dinner", "snack", "shake"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMealCategory(cat)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors",
                      mealCategory === cat
                        ? "bg-accent-orange text-bg-root"
                        : "bg-bg-elevated text-text-secondary"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAddMeal}
                className="w-full py-2.5 rounded-lg gradient-orange text-sm font-semibold text-bg-root transition-opacity hover:opacity-90"
              >
                Log Meal
              </button>
            </motion.div>
          )}

          {/* Meal list */}
          <div className="space-y-2">
            {todayMeals.length === 0 ? (
              <p className="text-sm text-text-tertiary py-4 text-center">
                No meals logged today. Tap + to add.
              </p>
            ) : (
              todayMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-border-subtle"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {meal.name}
                    </p>
                    <p className="text-xs text-text-secondary capitalize">
                      {meal.category}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-mono font-semibold text-accent-orange">
                      {meal.calories} cal
                    </p>
                    <p className="text-[10px] text-text-tertiary font-mono">
                      P:{meal.protein}g C:{meal.carbs}g F:{meal.fats}g
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* ── Weight ── */}
        <motion.div variants={staggerItem}>
          <div className="flex items-center justify-between mb-2">
            <SectionTitle className="mb-0">Body Weight</SectionTitle>
            <button
              onClick={() => setShowWeightForm(!showWeightForm)}
              className="flex items-center gap-1 text-xs text-accent-orange font-medium"
            >
              <Scale size={14} />
              Log
            </button>
          </div>

          {showWeightForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex gap-2 mb-3"
            >
              <input
                type="number"
                step="0.1"
                placeholder="Weight (kg)"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-orange focus:outline-none"
              />
              <button
                onClick={handleAddWeight}
                className="px-4 py-2 rounded-lg gradient-orange text-sm font-semibold text-bg-root"
              >
                Save
              </button>
            </motion.div>
          )}

          <StatBlock
            icon={<Scale size={18} />}
            label="Current Weight"
            value={latestWeight ? `${latestWeight.weight} kg` : "Not logged"}
            color="orange"
          />
        </motion.div>

        {/* ── Quick Stats ── */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Stats</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <StatBlock
              icon={<Utensils size={18} />}
              label="Meals Today"
              value={todayMeals.length}
              color="orange"
            />
            <StatBlock
              icon={<TrendingUp size={18} />}
              label="Calorie Goal"
              value={`${Math.round(calcProgress(todayCalories, dailyCalorieGoal))}%`}
              color="amber"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Helpers ──

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2", className)}>
      {children}
    </h2>
  );
}

function MacroBar({
  label,
  value,
  goal,
  unit,
  color,
}: {
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: "emerald" | "violet" | "blue" | "orange" | "amber";
}) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[60px]">
      <span className="text-xs text-text-secondary">{label}</span>
      <span className="text-sm font-mono font-semibold text-text-primary">
        {value}
        <span className="text-text-tertiary">{unit}</span>
      </span>
      <ProgressBar
        progress={calcProgress(value, goal)}
        color={color}
        size="sm"
      />
    </div>
  );
}
