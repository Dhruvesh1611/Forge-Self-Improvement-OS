"use client";

import { cn } from "@/lib/utils";
import { getLevelProgress } from "@/lib/constants";
import { ProgressBar } from "./progress-bar";

interface LevelBadgeProps {
  totalXP: number;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: {
    badge: "w-8 h-8 text-sm",
    ring: "w-10 h-10",
  },
  md: {
    badge: "w-12 h-12 text-lg",
    ring: "w-14 h-14",
  },
  lg: {
    badge: "w-16 h-16 text-2xl",
    ring: "w-[72px] h-[72px]",
  },
};

const colorRingClasses = {
  gray: "border-text-tertiary",
  blue: "border-accent-blue",
  emerald: "border-accent-emerald",
  violet: "border-accent-violet",
  amber: "border-accent-amber",
};

const colorGlowClasses = {
  gray: "",
  blue: "glow-blue",
  emerald: "glow-emerald",
  violet: "glow-violet",
  amber: "glow-amber",
};

const colorBarMap: Record<string, "emerald" | "violet" | "blue" | "orange" | "amber" | "rose"> = {
  gray: "violet",
  blue: "blue",
  emerald: "emerald",
  violet: "violet",
  amber: "amber",
};

export function LevelBadge({
  totalXP,
  showProgress = false,
  size = "md",
  className,
}: LevelBadgeProps) {
  const { current, next, currentXP, requiredXP, progress } =
    getLevelProgress(totalXP);
  const sizes = sizeMap[size];

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Badge Circle */}
      <div
        className={cn(
          "relative flex items-center justify-center",
          "rounded-full",
          sizes.ring
        )}
      >
        {/* Glow ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2",
            colorRingClasses[current.color],
            colorGlowClasses[current.color]
          )}
        />
        {/* Inner badge */}
        <div
          className={cn(
            "flex items-center justify-center rounded-full",
            "bg-bg-surface font-bold font-mono",
            "text-text-primary",
            sizes.badge
          )}
        >
          {current.level}
        </div>
      </div>

      {/* Title */}
      <span className="text-xs font-medium text-text-secondary">
        {current.title}
      </span>

      {/* Progress bar */}
      {showProgress && next && (
        <div className="w-full max-w-[160px]">
          <ProgressBar
            progress={progress}
            color={colorBarMap[current.color]}
            size="sm"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] font-mono text-text-tertiary">
              {currentXP.toLocaleString()} XP
            </span>
            <span className="text-[10px] font-mono text-text-tertiary">
              {requiredXP.toLocaleString()} XP
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
