"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronDown,
  ClipboardList,
  LogOut,
  Map,
  MessageCircle,
  Radio,
  Route,
  Settings,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import type { CurrentUser } from "@/types/user.types";
import { useLogout } from "@/hooks/use-logout";
import type { DashboardCounts } from "@/types/dashboard.types";
type SidebarCountKey = keyof DashboardCounts;
interface OperationLink {
  label: string;
  href: string;
  icon: typeof Radio;
  count?: string;
  countKey?: SidebarCountKey;
}
const operationLinks: OperationLink[] = [
  {
    label: "Live map",
    href: "/dashboard",
    icon: Radio,
  },
  {
    label: "Trips",
    href: "#",
    icon: Route,
    count: "8",
  },
  {
    label: "Trucks",
    href: "/dashboard/trucks",
    icon: Truck,
    countKey: "trucks",
  },
  {
    label: "Drivers",
    href: "/dashboard/drivers",
    icon: Users,
    countKey: "drivers",
  },
  {
    label: "Chat",
    href: "/dashboard/chat",
    icon: MessageCircle,
  },
  {
    label: "Maintenance",
    href: "#",
    icon: Wrench,
    count: "12",
  },
  {
    label: "Routes",
    href: "#",
    icon: Map,
  },
  {
    label: "Reports",
    href: "#",
    icon: BarChart3,
  },
  {
    label: "Compliance",
    href: "#",
    icon: ClipboardList,
    count: "ELO",
  },
  {
    label: "Settings",
    href: "#",
    icon: Settings,
  },
];
interface SidebarProps {
  user: CurrentUser | null;
  counts: DashboardCounts | null;
}
const getInitials = (name: string): string => {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};
export default function Sidebar({ user, counts }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useLogout();
  const userInitials = user ? getInitials(user.name) : "--";
  return (
    <aside className="hidden w-60 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:flex lg:flex-col">
      <div className="flex h-[68px] items-center gap-3 border-b border-[var(--color-border)] px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-bold text-white">
          »
        </div>
        <span className="text-sm font-bold tracking-tight text-[var(--foreground)]">
          Convoy
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-left outline-none transition-colors duration-300 hover:border-[var(--color-primary)] focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)]"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--foreground)] text-[10px] font-semibold text-white">
            WF
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-[var(--color-muted)]">Workspace</p>
            <p className="truncate text-xs font-semibold text-[var(--foreground)]">
              Western Freight
            </p>
          </div>
          <ChevronDown size={14} className="text-[var(--color-muted)]" />
        </button>
        <div className="mt-7">
          <p className="px-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
            Operations
          </p>
          <nav className="mt-2 space-y-1">
            {operationLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)] ${
                    isActive
                      ? "bg-[var(--color-primary-light)] font-medium text-[var(--color-primary)]"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  <Icon size={15} strokeWidth={1.8} />
                  <span className="flex-1">{item.label}</span>
                  {(item.countKey || item.count) && (
                    <span
                      className={`text-[9px] ${
                        isActive
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-muted)]"
                      }`}
                    >
                      <span className="rounded-md bg-[var(--color-surface-soft)] px-2 py-1 text-[8px] font-semibold text-[var(--color-muted)]">
                        {item.countKey
                          ? (counts?.[item.countKey] ?? 0)
                          : item.count}
                      </span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto pt-8">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-primary-light)] p-3">
            <p className="text-[9px] font-medium text-[var(--color-muted)]">
              Pro Plan
            </p>
            <h3 className="mt-1 text-xs font-semibold text-[var(--foreground)]">
              Upgrade to Pro
            </h3>
            <p className="mt-2 text-[9px] leading-4 text-[var(--color-muted)]">
              Get real-time fleet insights, predictive maintenance and advanced
              route optimization.
            </p>
            <button
              type="button"
              className="mt-3 w-full rounded-md bg-[var(--color-primary)] px-2 py-1.5 text-[9px] font-medium text-white transition-colors duration-300 hover:bg-[var(--color-primary-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              Upgrade · $49/mo
            </button>
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[10px] font-semibold text-[var(--color-primary)]">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-semibold text-[var(--foreground)]">
                {user?.name ?? "Loading..."}
              </p>
              <p className="truncate text-[9px] text-[var(--color-muted)]">
                {user?.email ?? "Loading..."}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Logout"
              title="Logout"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-muted)] outline-none transition-colors duration-300 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-danger)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={15} strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
