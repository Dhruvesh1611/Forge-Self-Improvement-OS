"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  Dumbbell,
  BookOpen,
  CheckCircle2,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Bulk", icon: Dumbbell, href: "/bulk" },
  { label: "Study", icon: BookOpen, href: "/study" },
  { label: "Habits", icon: CheckCircle2, href: "/habits" },
  { label: "Me", icon: User, href: "/me" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "glass safe-bottom",
        "border-t border-border-subtle",
        "lg:hidden"
      )}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center",
                "w-16 h-12 rounded-xl transition-colors duration-200",
                "touch-target",
                isActive
                  ? "text-accent-violet"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 rounded-xl bg-accent-violet/10"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                className="relative z-10 flex flex-col items-center gap-0.5"
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all duration-200"
                />
                <span
                  className={cn(
                    "text-[10px] leading-none font-medium transition-all duration-200",
                    isActive ? "opacity-100" : "opacity-70"
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
