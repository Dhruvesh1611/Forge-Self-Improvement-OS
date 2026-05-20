"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface XPToast {
  id: string;
  amount: number;
  reason: string;
}

interface XPIndicatorProps {
  className?: string;
}

// Global event system for XP notifications
const xpListeners: Set<(toast: XPToast) => void> = new Set();

export function emitXPGain(amount: number, reason: string) {
  const toast: XPToast = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    amount,
    reason,
  };
  xpListeners.forEach((listener) => listener(toast));
}

export function XPIndicator({ className }: XPIndicatorProps) {
  const [toasts, setToasts] = useState<XPToast[]>([]);

  useEffect(() => {
    const listener = (toast: XPToast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 2000);
    };

    xpListeners.add(listener);
    return () => {
      xpListeners.delete(listener);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-20 right-4 z-[60] flex flex-col items-end gap-2",
        "lg:bottom-4",
        className
      )}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl",
              "bg-accent-violet/20 border border-accent-violet/30",
              "glow-violet",
              "text-sm font-semibold text-accent-violet"
            )}
          >
            <Sparkles size={14} />
            <span className="font-mono">+{toast.amount} XP</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
