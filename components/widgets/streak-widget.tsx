"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface StreakWidgetProps {
  label: string;
  days: number;
  icon?: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function StreakWidget({
  label,
  days,
  icon,
  isActive = true,
  className,
}: StreakWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -1 }}
      className={cn(
        "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl",
        "bg-bg-surface border transition-all duration-300",
        isActive && days > 0
          ? "border-accent-amber/20 glow-amber"
          : "border-border-subtle",
        className
      )}
    >
      {/* Fire / Icon */}
      <div className="shrink-0">
        {icon || (
          <motion.div
            animate={
              isActive && days >= 7
                ? {
                    scale: [1, 1.1, 1],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
                : {}
            }
          >
            <Flame
              size={20}
              className={cn(
                "transition-colors duration-300",
                isActive && days > 0
                  ? "text-accent-amber"
                  : "text-text-tertiary"
              )}
              fill={isActive && days > 0 ? "currentColor" : "none"}
            />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0">
        <p className="text-lg font-bold font-mono text-text-primary leading-none">
          {days}
        </p>
        <p className="text-[10px] text-text-secondary mt-0.5 truncate">
          {label}
        </p>
      </div>
    </motion.div>
  );
}
