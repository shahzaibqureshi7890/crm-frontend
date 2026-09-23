"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDashboardCounts } from "@/hooks/use-dashboard-counts";
interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user } = useCurrentUser();
  const { counts } = useDashboardCounts();
  return (
    <div className="flex h-screen min-h-0 bg-[var(--background)]">
      <Sidebar user={user} counts={counts} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[60px] items-center border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 lg:hidden">
          <button
            type="button"
            aria-label="Open Navigation"
            aria-expanded={isMobileSidebarOpen}
            onClick={() => setIsMobileSidebarOpen(true)}
            className="rounded-lg border border-[var(--color-border-strong)] p-2 text-[var(--color-muted)] transition-colors duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <Menu size={20} strokeWidth={2} />
          </button>
          <div className="ml-3 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)] text-xs font-bold text-white">
              »
            </div>
            <span className="text-sm font-bold tracking-tight text-[var(--foreground)]">
              Convoy
            </span>
          </div>
        </header>
        <main className="min-h-0 min-w-0 flex-1">{children}</main>
      </div>
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        user={user}
        counts={counts}
      />
    </div>
  );
}
