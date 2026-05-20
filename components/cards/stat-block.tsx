"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerItem } from "@/lib/animations";
import type { AccentColor } from "@/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatBlockProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; label: string };
  color?: AccentColor;
  className?: string;
}

const accentBg: Record<AccentColor, string> = {
  emerald: "bg-accent-emerald-dim",
  violet: "bg-accent-violet-dim",
  blue: "bg-accent-blue-dim",
  orange: "bg-accent-orange-dim",
  amber: "bg-accent-amber-dim",
  rose: "bg-accent-rose-dim",
};

const accentText: Record<AccentColor, string> = {
  emerald: "text-accent-emerald",
  violet: "text-accent-violet",
  blue: "text-accent-blue",
  orange: "text-accent-orange",
  amber: "text-accent-amber",
  rose: "text-accent-rose",
};

export function StatBlock({
  icon,
  label,
  value,
  trend,
  color = "emerald",
  className,
}: StatBlockProps) {
  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl",
        "bg-bg-surface border border-border-subtle",
        "transition-colors duration-200 hover:bg-bg-elevated",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
          accentBg[color]
        )}
      >
        <div className={accentText[color]}>{icon}</div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-secondary truncate">{label}</p>
        <p className="text-base font-semibold font-mono text-text-primary">
          {value}
        </p>
      </div>

      {/* Trend */}
      {trend && (
        <div
          className={cn("flex items-center gap-0.5 text-xs font-medium shrink-0", {
            "text-accent-emerald": trend.value > 0,
            "text-accent-rose": trend.value < 0,
            "text-text-tertiary": trend.value === 0,
          })}
        >
          {trend.value > 0 ? (
            <TrendingUp size={12} />
          ) : trend.value < 0 ? (
            <TrendingDown size={12} />
          ) : (
            <Minus size={12} />
          )}
          <span>{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}
