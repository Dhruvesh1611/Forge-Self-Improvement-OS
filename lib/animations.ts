// ═══════════════════════════════════════════════
// FORGE — Animation Presets (Framer Motion)
// ═══════════════════════════════════════════════

import type { Transition, Variants } from "framer-motion";

// ──────────────────────────────────────────────
// Transition Presets
// ──────────────────────────────────────────────

export const transitions = {
  fast: { duration: 0.15, ease: "easeOut" } as Transition,
  normal: { duration: 0.25, ease: "easeOut" } as Transition,
  slow: { duration: 0.4, ease: "easeOut" } as Transition,
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 25,
  } as Transition,
  springBouncy: {
    type: "spring",
    stiffness: 300,
    damping: 15,
  } as Transition,
  springGentle: {
    type: "spring",
    stiffness: 200,
    damping: 20,
  } as Transition,
} as const;

// ──────────────────────────────────────────────
// Page Transition Variants
// ──────────────────────────────────────────────

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// ──────────────────────────────────────────────
// Staggered List Variants
// ──────────────────────────────────────────────

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// ──────────────────────────────────────────────
// Card Variants
// ──────────────────────────────────────────────

export const cardVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// ──────────────────────────────────────────────
// Modal / Sheet Variants
// ──────────────────────────────────────────────

export const modalOverlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContentVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15 },
  },
};

export const bottomSheetVariants: Variants = {
  initial: { y: "100%" },
  animate: {
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    y: "100%",
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

// ──────────────────────────────────────────────
// Progress Animations
// ──────────────────────────────────────────────

export const progressRingVariants: Variants = {
  initial: { pathLength: 0 },
  animate: (progress: number) => ({
    pathLength: progress / 100,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
  }),
};

export const progressBarVariants: Variants = {
  initial: { scaleX: 0 },
  animate: {
    scaleX: 1,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.1 },
  },
};

// ──────────────────────────────────────────────
// Micro-interaction Variants
// ──────────────────────────────────────────────

export const checkBounce: Variants = {
  initial: { scale: 1 },
  checked: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const numberRoll: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const floatUp: Variants = {
  initial: { opacity: 1, y: 0 },
  animate: {
    opacity: 0,
    y: -30,
    transition: { duration: 1.5, ease: "easeOut" },
  },
};

export const glowPulse: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

export const shakeWarning: Variants = {
  initial: { x: 0 },
  animate: {
    x: [-2, 2, -2, 2, 0],
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

// ──────────────────────────────────────────────
// Tab Indicator
// ──────────────────────────────────────────────

export const tabIndicatorVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },
};

// ──────────────────────────────────────────────
// Confetti / Celebration
// ──────────────────────────────────────────────

export const celebrationVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
  exit: {
    opacity: 0,
    scale: 1.2,
    transition: { duration: 0.3 },
  },
};

// ──────────────────────────────────────────────
// Skeleton shimmer (CSS-based, not framer)
// This is used as a className reference
// ──────────────────────────────────────────────

export const SKELETON_SHIMMER_CLASS = "animate-shimmer";
