"use client";

import { cn } from "@/lib/utils";

interface HabitChainProps {
  /** Array of 7 booleans (Mon-Sun) */
  days: boolean[];
  /** Accent color for completed dots */
  color?: "emerald" | "violet" | "blue" | "orange" | "amber";
  className?: string;
}

const dotColorMap = {
  emerald: "bg-accent-emerald",
  violet: "bg-accent-violet",
  blue: "bg-accent-blue",
  orange: "bg-accent-orange",
  amber: "bg-accent-amber",
};

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

export function HabitChain({
  days,
  color = "emerald",
  className,
}: HabitChainProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {days.map((completed, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className={cn(
              "w-5 h-5 rounded-full transition-all duration-300",
              "flex items-center justify-center",
              completed
                ? dotColorMap[color]
                : "bg-bg-elevated border border-border-subtle"
            )}
          >
            {completed && (
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="text-bg-root"
              >
                <path
                  d="M2 5L4.5 7.5L8 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-[8px] text-text-tertiary font-medium">
            {dayLabels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}
