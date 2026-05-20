"use client";

import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  subtitle?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  className?: string;
}

export function TopBar({
  title,
  subtitle,
  leftElement,
  rightElement,
  className,
}: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "flex items-center justify-between",
        "h-14 px-4 lg:px-6",
        "glass safe-top",
        "border-b border-border-subtle",
        className
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {leftElement}
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-text-primary truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-text-secondary truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right */}
      {rightElement && (
        <div className="flex items-center gap-2 ml-3 shrink-0">
          {rightElement}
        </div>
      )}
    </header>
  );
}
