"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0-100
  color?: "emerald" | "violet" | "blue" | "orange" | "amber" | "rose";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const colorClasses = {
  emerald: "gradient-emerald",
  violet: "gradient-violet",
  blue: "gradient-blue",
  orange: "gradient-orange",
  amber: "gradient-amber",
  rose: "bg-accent-rose",
};

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
};

export function ProgressBar({
  progress,
  color = "emerald",
  size = "md",
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs font-medium text-text-secondary">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-xs font-mono font-medium text-text-secondary">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full overflow-hidden bg-bg-elevated",
          sizeClasses[size]
        )}
      >
        <motion.div
          className={cn("h-full rounded-full", colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}
