"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  BarChart3,
  ChevronDown,
  ClipboardList,
  LogOut,
  Map,
  Radio,
  Route,
  Settings,
  Truck,
  Users,
  Wrench,
  X,
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

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function MobileSidebar({
  isOpen,
  onClose,
  user,
  counts,
}: MobileSidebarProps) {
  const pathname = usePathname();

  const { logout } = useLogout();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const desktopMediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        document.body.style.overflow = originalOverflow;
        onClose();
      }
    };

    desktopMediaQuery.addEventListener("change", handleDesktopChange);

    return () => {
      document.body.style.overflow = originalOverflow;

      desktopMediaQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [isOpen, onClose]);

  const userInitials = user ? getInitials(user.name) : "--";

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-[var(--color-border)] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-bold text-white">
              »
            </div>

            <span className="text-sm font-bold tracking-tight text-[var(--foreground)]">
              Convoy
            </span>
          </div>

          <button
            type="button"
            aria-label="Close Navigation"
            onClick={onClose}
            className="rounded-lg border border-[var(--color-border-strong)] p-2 text-[var(--color-muted)] transition-colors duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <X size={19} strokeWidth={2} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-left transition-colors duration-300 hover:border-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
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
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-xs transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
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
                Get real-time fleet insights, predictive maintenance and
                advanced route optimization.
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
                onClick={handleLogout}
                aria-label="Logout"
                title="Logout"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors duration-300 hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                <LogOut size={15} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
