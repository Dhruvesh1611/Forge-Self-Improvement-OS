"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format, startOfWeek, addDays, subWeeks, isSameDay, parseISO } from "date-fns";

interface HeatmapProps {
  /** Array of date strings (YYYY-MM-DD) that have activity */
  dates: string[];
  /** Number of weeks to show */
  weeks?: number;
  /** Color scheme */
  color?: "emerald" | "violet" | "blue" | "orange";
  /** Whether to show month labels */
  showMonths?: boolean;
  /** Whether to show day labels */
  showDays?: boolean;
  className?: string;
}

const colorSchemes = {
  emerald: [
    "bg-heatmap-0",
    "bg-heatmap-1",
    "bg-heatmap-2",
    "bg-heatmap-3",
    "bg-heatmap-4",
  ],
  violet: [
    "bg-bg-elevated",
    "bg-accent-violet-dim",
    "bg-accent-violet/30",
    "bg-accent-violet/50",
    "bg-accent-violet",
  ],
  blue: [
    "bg-bg-elevated",
    "bg-accent-blue-dim",
    "bg-accent-blue/30",
    "bg-accent-blue/50",
    "bg-accent-blue",
  ],
  orange: [
    "bg-bg-elevated",
    "bg-accent-orange-dim",
    "bg-accent-orange/30",
    "bg-accent-orange/50",
    "bg-accent-orange",
  ],
};

const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

export function Heatmap({
  dates,
  weeks = 12,
  color = "emerald",
  showMonths = true,
  showDays = true,
  className,
}: HeatmapProps) {
  const grid = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(subWeeks(today, weeks - 1), {
      weekStartsOn: 1,
    });
    const dateSet = new Set(dates);

    // Count occurrences per date for intensity
    const dateCount: Record<string, number> = {};
    dates.forEach((d) => {
      dateCount[d] = (dateCount[d] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(dateCount), 1);

    const weeksArr: { date: Date; level: number; dateStr: string }[][] = [];
    let currentDate = start;

    for (let w = 0; w < weeks; w++) {
      const week: { date: Date; level: number; dateStr: string }[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = format(currentDate, "yyyy-MM-dd");
        const count = dateCount[dateStr] || 0;
        const isFuture = currentDate > today;
        let level = 0;

        if (!isFuture && count > 0) {
          level = Math.min(Math.ceil((count / maxCount) * 4), 4);
        }

        week.push({ date: new Date(currentDate), level, dateStr });
        currentDate = addDays(currentDate, 1);
      }
      weeksArr.push(week);
    }

    return weeksArr;
  }, [dates, weeks]);

  const colors = colorSchemes[color];

  // Get month labels
  const monthLabels = useMemo(() => {
    if (!showMonths) return [];
    const labels: { label: string; index: number }[] = [];
    let lastMonth = -1;

    grid.forEach((week, i) => {
      const firstDay = week[0].date;
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        labels.push({ label: format(firstDay, "MMM"), index: i });
        lastMonth = month;
      }
    });

    return labels;
  }, [grid, showMonths]);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Month labels */}
      {showMonths && (
        <div className="flex ml-6 mb-1">
          {monthLabels.map((m, i) => (
            <span
              key={i}
              className="text-[9px] text-text-tertiary"
              style={{
                marginLeft: i === 0 ? `${m.index * 14}px` : undefined,
                width: `${
                  (i < monthLabels.length - 1
                    ? monthLabels[i + 1].index - m.index
                    : grid.length - m.index) * 14
                }px`,
              }}
            >
              {m.label}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-0.5">
        {/* Day labels */}
        {showDays && (
          <div className="flex flex-col gap-0.5 mr-1 shrink-0">
            {dayLabels.map((label, i) => (
              <span
                key={i}
                className="text-[9px] text-text-tertiary h-[10px] flex items-center leading-none"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="flex gap-0.5 overflow-x-auto no-scrollbar">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day, di) => {
                const isFuture = day.date > new Date();
                const isToday = isSameDay(day.date, new Date());

                return (
                  <motion.div
                    key={day.dateStr}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: (wi * 7 + di) * 0.003,
                      duration: 0.2,
                    }}
                    title={`${format(day.date, "MMM d, yyyy")}: ${
                      day.level > 0
                        ? `Level ${day.level}`
                        : isFuture
                        ? "Future"
                        : "No activity"
                    }`}
                    className={cn(
                      "w-[10px] h-[10px] rounded-[2px] transition-colors duration-200",
                      isFuture ? "bg-bg-surface/50" : colors[day.level],
                      isToday && "ring-1 ring-text-secondary/30"
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
