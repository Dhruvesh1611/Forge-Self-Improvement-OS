"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

interface QuoteCardProps {
  text: string;
  author: string;
  className?: string;
}

export function QuoteCard({ text, author, className }: QuoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        "relative overflow-hidden p-5 rounded-2xl",
        "bg-gradient-to-br from-accent-violet-dim/60 to-bg-surface",
        "border border-accent-violet/10",
        className
      )}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent-violet/5 blur-2xl" />

      {/* Quote icon */}
      <Quote
        size={16}
        className="text-accent-violet/40 mb-2"
      />

      {/* Quote text */}
      <p className="text-sm leading-relaxed text-text-primary/90 italic">
        &ldquo;{text}&rdquo;
      </p>

      {/* Author */}
      <p className="text-xs text-text-secondary mt-3 font-medium">
        — {author}
      </p>
    </motion.div>
  );
}
