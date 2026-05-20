"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Flame } from "lucide-react";

interface HabitCardProps {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completed: boolean;
  onToggle: (id: string) => void;
  className?: string;
}

export function HabitCard({
  id,
  name,
  icon,
  streak,
  completed,
  onToggle,
  className,
}: HabitCardProps) {
  const [justCompleted, setJustCompleted] = useState(false);

  const handleToggle = useCallback(() => {
    if (!completed) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 600);
    }
    onToggle(id);
  }, [id, completed, onToggle]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-3 p-3.5 rounded-xl",
        "bg-bg-surface border transition-all duration-300",
        completed
          ? "border-accent-emerald/30 glow-emerald"
          : "border-border-subtle hover:border-border-default",
        className
      )}
    >
      {/* Check button */}
      <motion.button
        onClick={handleToggle}
        whileTap={{ scale: 0.85 }}
        animate={
          justCompleted
            ? {
                scale: [1, 1.2, 1],
                transition: { duration: 0.3 },
              }
            : {}
        }
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
          "transition-all duration-300 touch-target",
          completed
            ? "bg-accent-emerald text-bg-root"
            : "bg-bg-elevated border border-border-default text-text-tertiary hover:border-accent-emerald/50"
        )}
        aria-label={`${completed ? "Uncomplete" : "Complete"} ${name}`}
      >
        {completed ? (
          <Check size={18} strokeWidth={3} />
        ) : (
          <span className="text-lg">{icon}</span>
        )}
      </motion.button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium transition-all duration-300",
            completed
              ? "text-text-secondary line-through decoration-text-tertiary"
              : "text-text-primary"
          )}
        >
          {name}
        </p>
        {streak > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <Flame
              size={12}
              className={cn(
                "transition-colors duration-300",
                streak >= 7 ? "text-accent-amber" : "text-accent-orange"
              )}
            />
            <span
              className={cn(
                "text-xs font-mono font-medium",
                streak >= 7 ? "text-accent-amber" : "text-accent-orange"
              )}
            >
              {streak} day{streak !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
