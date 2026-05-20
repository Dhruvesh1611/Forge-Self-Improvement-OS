"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: "emerald" | "violet" | "blue" | "orange" | "amber" | "rose";
  label?: string;
  sublabel?: string;
  className?: string;
}

const colorMap = {
  emerald: {
    stroke: "url(#gradient-emerald)",
    text: "text-accent-emerald",
    gradientStart: "oklch(0.696 0.17 162)",
    gradientEnd: "oklch(0.55 0.14 162)",
  },
  violet: {
    stroke: "url(#gradient-violet)",
    text: "text-accent-violet",
    gradientStart: "oklch(0.606 0.2 275)",
    gradientEnd: "oklch(0.5 0.18 290)",
  },
  blue: {
    stroke: "url(#gradient-blue)",
    text: "text-accent-blue",
    gradientStart: "oklch(0.623 0.2 255)",
    gradientEnd: "oklch(0.5 0.18 240)",
  },
  orange: {
    stroke: "url(#gradient-orange)",
    text: "text-accent-orange",
    gradientStart: "oklch(0.702 0.18 50)",
    gradientEnd: "oklch(0.6 0.16 35)",
  },
  amber: {
    stroke: "url(#gradient-amber)",
    text: "text-accent-amber",
    gradientStart: "oklch(0.769 0.16 75)",
    gradientEnd: "oklch(0.65 0.15 60)",
  },
  rose: {
    stroke: "url(#gradient-rose)",
    text: "text-accent-rose",
    gradientStart: "oklch(0.592 0.2 15)",
    gradientEnd: "oklch(0.5 0.18 0)",
  },
};

export function ProgressRing({
  progress,
  size = 100,
  strokeWidth = 8,
  color = "emerald",
  label,
  sublabel,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const colors = colorMap[color];

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient
            id={`gradient-${color}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={colors.gradientStart} />
            <stop offset="100%" stopColor={colors.gradientEnd} />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="oklch(0.217 0 0)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset:
              circumference - (clampedProgress / 100) * circumference,
          }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </svg>

      {/* Center content */}
      {(label || sublabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {label && (
            <span
              className={cn(
                "font-mono font-bold leading-none",
                colors.text,
                size >= 100 ? "text-xl" : "text-sm"
              )}
            >
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[10px] text-text-secondary mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
