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

export function SideRail() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex",
        "fixed left-0 top-0 bottom-0 z-50",
        "w-[72px] flex-col items-center py-6 gap-2",
        "bg-bg-surface border-r border-border-subtle"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-violet/20 mb-6">
        <span className="text-lg font-bold text-accent-violet">F</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col items-center gap-1">
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
              title={item.label}
              className={cn(
                "relative flex items-center justify-center",
                "w-12 h-12 rounded-xl transition-colors duration-200",
                isActive
                  ? "text-accent-violet"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
              )}
            >
              {isActive && (
                <>
                  <motion.div
                    layoutId="sideRailIndicator"
                    className="absolute left-0 w-[3px] h-6 rounded-r-full bg-accent-violet"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                  <motion.div
                    layoutId="sideRailBg"
                    className="absolute inset-0 rounded-xl bg-accent-violet/10"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                </>
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className="relative z-10"
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
