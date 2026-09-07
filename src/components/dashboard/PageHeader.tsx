"use client";
import { Bell } from "lucide-react";

export default function PageHeader() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex min-h-[72px] flex-col gap-3 px-4 py-3.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight text-[var(--foreground)] sm:text-[17px]">
              Fleet Status
            </h1>
            <span className="text-[10px] text-[var(--color-border-strong)]">
              -
            </span>
            <span className="text-[10px] text-[var(--color-muted)] sm:text-[11px]">
              Tuesday, May 21 · 07:30 MT
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[var(--color-muted)]">
            <span>
              <strong className="font-semibold text-[var(--foreground)]">
                84
              </strong>
              <span className="ml-1">trucks</span>
            </span>
            <span className="text-[var(--color-border-strong)]">•</span>
            <span>
              <strong className="font-semibold text-[var(--foreground)]">
                76
              </strong>
              <span className="ml-1">on the road</span>
            </span>
            <span className="text-[var(--color-border-strong)]">•</span>
            <span>
              <strong className="font-semibold text-[var(--foreground)]">
                8
              </strong>
              <span className="ml-1">in yard</span>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="flex max-w-full items-center overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-0.5">
            <button
              type="button"
              className="rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-[10px] font-medium text-white outline-none transition-colors duration-300 hover:bg-[var(--color-primary-dark)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)]"
            >
              All Vehicles
            </button>
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-[10px] font-medium text-[var(--color-muted)] outline-none transition-colors duration-300 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)]"
            >
              By Terminal
            </button>
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-[10px] font-medium text-[var(--color-muted)] outline-none transition-colors duration-300 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)]"
            >
              By Route Type
            </button>
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-[10px] font-medium text-[var(--color-muted)] outline-none transition-colors duration-300 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)]"
            >
              By Status
            </button>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] outline-none transition-colors duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)]"
          >
            <Bell size={15} strokeWidth={1.8} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-danger)]" />
          </button>
        </div>
      </div>
    </header>
  );
}
