"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useUserStore } from "@/lib/store/user-store";
import { TopBar } from "@/components/navigation/top-bar";
import Link from "next/link";

export default function SettingsPage() {
  const profile = useUserStore((s) => s.profile);
  const updateSettings = useUserStore((s) => s.updateSettings);
  const updateName = useUserStore((s) => s.updateName);

  const [name, setName] = useState(profile.name);
  const [calorieGoal, setCalorieGoal] = useState(profile.settings.dailyCalorieGoal.toString());
  const [proteinGoal, setProteinGoal] = useState(profile.settings.dailyProteinGoal.toString());
  const [waterGoal, setWaterGoal] = useState(profile.settings.dailyWaterGoal.toString());
  const [studyGoal, setStudyGoal] = useState(profile.settings.dailyStudyHoursGoal.toString());
  const [dsaGoal, setDsaGoal] = useState(profile.settings.dailyDSAGoal.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateName(name);
    updateSettings({
      dailyCalorieGoal: parseInt(calorieGoal) || 2800,
      dailyProteinGoal: parseInt(proteinGoal) || 140,
      dailyWaterGoal: parseInt(waterGoal) || 8,
      dailyStudyHoursGoal: parseInt(studyGoal) || 4,
      dailyDSAGoal: parseInt(dsaGoal) || 2,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-dvh">
      <TopBar
        title="Settings"
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
        className="px-4 py-5 space-y-5 lg:px-8 lg:max-w-lg"
      >
        {/* Profile */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Profile</SectionTitle>
          <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle space-y-3">
            <SettingInput label="Name" value={name} onChange={setName} />
          </div>
        </motion.div>

        {/* Goals */}
        <motion.div variants={staggerItem}>
          <SectionTitle>Daily Goals</SectionTitle>
          <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle space-y-3">
            <SettingInput label="Calorie Goal" value={calorieGoal} onChange={setCalorieGoal} type="number" suffix="cal" />
            <SettingInput label="Protein Goal" value={proteinGoal} onChange={setProteinGoal} type="number" suffix="g" />
            <SettingInput label="Water Goal" value={waterGoal} onChange={setWaterGoal} type="number" suffix="glasses" />
            <SettingInput label="Study Hours" value={studyGoal} onChange={setStudyGoal} type="number" suffix="hours" />
            <SettingInput label="DSA Problems" value={dsaGoal} onChange={setDsaGoal} type="number" suffix="per day" />
          </div>
        </motion.div>

        {/* Save */}
        <motion.div variants={staggerItem}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300",
              saved
                ? "bg-accent-emerald text-bg-root"
                : "gradient-violet text-white hover:opacity-90"
            )}
          >
            {saved ? "✓ Saved!" : "Save Settings"}
          </motion.button>
        </motion.div>

        {/* App Info */}
        <motion.div variants={staggerItem}>
          <div className="text-center py-6">
            <p className="text-sm font-bold text-text-primary">Forge</p>
            <p className="text-xs text-text-tertiary mt-0.5">Self-Improvement OS v0.1.0</p>
            <p className="text-[10px] text-text-tertiary mt-1">Built with 🔥 by Dhruvesh</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SettingInput({
  label,
  value,
  onChange,
  type = "text",
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  suffix?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-text-secondary shrink-0">{label}</label>
      <div className="flex items-center gap-1.5">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary text-right font-mono focus:border-accent-violet focus:outline-none"
        />
        {suffix && (
          <span className="text-xs text-text-tertiary w-12">{suffix}</span>
        )}
      </div>
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
