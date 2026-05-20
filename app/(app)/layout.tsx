"use client";

import { BottomNav } from "@/components/navigation/bottom-nav";
import { SideRail } from "@/components/navigation/side-rail";
import { XPIndicator } from "@/components/progress/xp-indicator";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      {/* Desktop side rail */}
      <SideRail />

      {/* Main content area */}
      <main className="flex-1 lg:ml-[72px] pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />

      {/* XP notification toast */}
      <XPIndicator />
    </div>
  );
}
