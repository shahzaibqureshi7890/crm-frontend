import { Bell } from "lucide-react";
import GoogleMap from "@/components/dashboard/GoogleMap";
import PageHeader from "@/components/dashboard/PageHeader";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <PageHeader />
      <main className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.9fr)]">
          <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3.5 sm:px-5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  <span className="text-xs">⌖</span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <h2 className="text-xs font-semibold text-[var(--foreground)] sm:text-sm">
                      Fleet Overview
                    </h2>
                    <span className="text-[9px] text-[var(--color-muted)]">
                      Boise metro · live
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-medium text-[var(--color-primary)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                </span>
                Live
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--color-border)] px-4 py-2.5 sm:px-5">
              <span className="flex items-center gap-1.5 text-[9px] text-[var(--color-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                On schedule · 62
              </span>
              <span className="flex items-center gap-1.5 text-[9px] text-[var(--color-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-warning)]" />
                Slight delay · 14
              </span>
              <span className="flex items-center gap-1.5 text-[9px] text-[var(--color-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-danger)]" />
                Significant delay · 3
              </span>
              <span className="flex items-center gap-1.5 text-[9px] text-[var(--color-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
                Off duty / yard · 5
              </span>
            </div>
            <div className="mx-3 mb-3 mt-3 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] sm:mx-4 sm:mb-4">
              <div className="relative min-h-[260px] sm:min-h-[290px] lg:min-h-[310px]">
                <GoogleMap />
              </div>
            </div>
          </section>
          <section className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary-light)] text-xs font-semibold text-[var(--color-primary)]">
                  !
                </div>
                <div className="min-w-0">
                  <h2 className="text-xs font-semibold text-[var(--foreground)] sm:text-sm">
                    Needs Attention
                  </h2>
                </div>
              </div>
              <span className="shrink-0 rounded-md bg-[var(--color-danger)]/10 px-2 py-1 text-[8px] font-semibold text-[var(--color-danger)]">
                5 alerts
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-2 px-3 py-3">
              <div className="rounded-lg border border-[var(--color-border)] border-l-2 border-l-[var(--color-danger)] bg-[var(--color-surface)] px-3.5 py-3">
                <p className="text-[10px] font-semibold text-[var(--foreground)]">
                  Truck #4821 stopped
                </p>
                <p className="mt-1 text-[9px] leading-4 text-[var(--color-muted)]">
                  Near Pocatello, ID · driver reported engine warning light.
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-md bg-[var(--color-danger)]/10 px-2 py-1 text-[8px] font-medium text-[var(--color-danger)]">
                    • Stopped
                  </span>
                  <button
                    type="button"
                    className="text-[9px] font-semibold text-[var(--color-muted)] outline-none transition-colors duration-300 hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)]"
                  >
                    Call Driver →
                  </button>
                </div>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] border-l-2 border-l-[var(--color-warning)] bg-[var(--color-surface)] px-3.5 py-3">
                <p className="text-[10px] font-semibold text-[var(--foreground)]">
                  Truck #2148 behind schedule
                </p>
                <p className="mt-1 text-[9px] leading-4 text-[var(--color-muted)]">
                  Cargo: 24 pallets · Salt Lake City → Boise.
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-md bg-[var(--color-warning)]/10 px-2 py-1 text-[8px] font-medium text-[var(--color-warm)]">
                    • Delayed
                  </span>
                  <button
                    type="button"
                    className="text-[9px] font-semibold text-[var(--color-muted)] outline-none transition-colors duration-300 hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)]"
                  >
                    View Route →
                  </button>
                </div>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] border-l-2 border-l-[var(--color-warning)] bg-[var(--color-surface)] px-3.5 py-3">
                <p className="text-[10px] font-semibold text-[var(--foreground)]">
                  Driver Andre Foster
                </p>
                <p className="mt-1 text-[9px] leading-4 text-[var(--color-muted)]">
                  14 minutes remaining · scheduled maintenance break.
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-md bg-[var(--color-warning)]/10 px-2 py-1 text-[8px] font-medium text-[var(--color-warm)]">
                    • HOS
                  </span>
                  <button
                    type="button"
                    className="text-[9px] font-semibold text-[var(--color-muted)] outline-none transition-colors duration-300 hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)]"
                  >
                    Notify Driver →
                  </button>
                </div>
              </div>
            </div>
            <div className="px-3 pb-3">
              <button
                type="button"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2 text-center text-xs font-semibold text-[var(--color-muted)] outline-none transition-colors duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1"
              >
                View all 5 alerts →
              </button>
            </div>
          </section>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 transition-colors duration-300 hover:border-[var(--color-primary)]">
            <p className="text-[9px] font-medium text-[var(--color-muted)]">
              On-time delivery (today)
            </p>
            <p className="mt-2 text-xl font-semibold leading-none tracking-tight text-[var(--foreground)]">
              88%
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-[9px] text-[var(--color-muted)]">
              <span className="rounded-md bg-[var(--color-danger)]/10 px-2 py-1 text-[8px] font-semibold text-[var(--color-danger)]">
                ↓ 4pt
              </span>
              from week avg
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 transition-colors duration-300 hover:border-[var(--color-primary)]">
            <p className="text-[9px] font-medium text-[var(--color-muted)]">
              Avg miles per truck
            </p>
            <p className="mt-2 text-xl font-semibold leading-none tracking-tight text-[var(--foreground)]">
              384
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-[9px] text-[var(--color-muted)]">
              <span className="rounded-md bg-[var(--color-surface-soft)] px-2 py-1 text-[8px] font-semibold text-[var(--color-muted)]">
                flat
              </span>
              vs yesterday
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 transition-colors duration-300 hover:border-[var(--color-primary)]">
            <p className="text-[9px] font-medium text-[var(--color-muted)]">
              Fuel cost YTD
            </p>
            <p className="mt-2 text-xl font-semibold leading-none tracking-tight text-[var(--foreground)]">
              $1.42M
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-[9px] text-[var(--color-muted)]">
              <span className="rounded-md bg-[var(--color-warning)] px-2 py-1 text-[8px] font-semibold text-white">
                ↑ 6%
              </span>
              tracking ahead
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 transition-colors duration-300 hover:border-[var(--color-primary)]">
            <p className="text-[9px] font-medium text-[var(--color-muted)]">
              Active incidents
            </p>
            <p className="mt-2 text-xl font-semibold leading-none tracking-tight text-[var(--foreground)]">
              1
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-[9px] text-[var(--color-muted)]">
              <span className="rounded-md bg-[var(--color-danger)]/10 px-2 py-1 text-[8px] font-semibold text-[var(--color-danger)]">
                • Truck #4821
              </span>
            </p>
          </div>
        </div>
        <section className="mt-4 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3.5 sm:px-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                <span className="text-xs">↗</span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <h2 className="text-xs font-semibold text-[var(--foreground)] sm:text-sm">
                    Active Trips
                  </h2>
                  <span className="text-[9px] text-[var(--color-muted)]">
                    live
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-[var(--color-primary-light)] px-2.5 py-1.5 text-[9px] font-semibold text-[var(--color-primary)] outline-none transition-colors duration-300 hover:bg-[var(--color-primary)] hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1"
            >
              View All Trips
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[9px] text-[var(--color-muted)]">
                  <th className="px-4 py-2.5 font-semibold sm:px-5">Truck #</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-5">Driver</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-5">Route</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-5">ETA</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-5">Status</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-5">
                    Last Update
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                <tr className="text-[10px] transition-colors duration-300 hover:bg-[var(--color-surface-soft)]">
                  <td className="px-4 py-3.5 font-semibold text-[var(--foreground)] sm:px-5">
                    #4821
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[9px] font-semibold text-[var(--color-primary)]">
                        MR
                      </span>
                      <span className="text-[10px] text-[var(--color-muted)]">
                        Marcus Reyes
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-muted)]">
                    Boise → Pocatello
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-[var(--color-muted)]">
                      <span className="text-[10px]">◷</span>
                      <span className="text-[10px]">2h 24m</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex rounded-md bg-[var(--color-primary-light)] px-2 py-1 text-[8px] font-semibold text-[var(--color-primary)]">
                      • On route
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-muted)]">
                    47 min ago
                  </td>
                </tr>
                <tr className="text-[10px] transition-colors duration-300 hover:bg-[var(--color-surface-soft)]">
                  <td className="px-4 py-3.5 font-semibold text-[var(--foreground)] sm:px-5">
                    #2148
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[9px] font-semibold text-[var(--color-primary)]">
                        JW
                      </span>
                      <span className="text-[10px] text-[var(--color-muted)]">
                        James Wilson
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-muted)]">
                    Salt Lake City → Boise
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-[var(--color-muted)]">
                      <span className="text-[10px]">◷</span>
                      <span className="text-[10px]">3h 12m</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-md bg-[var(--color-danger)]/10 px-2 py-1 text-[8px] font-semibold text-[var(--color-danger)]">
                      • Delayed
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-muted)]">
                    47 min ago
                  </td>
                </tr>
                <tr className="text-[10px] transition-colors duration-300 hover:bg-[var(--color-surface-soft)]">
                  <td className="px-4 py-3.5 font-semibold text-[var(--foreground)] sm:px-5">
                    #3192
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[9px] font-semibold text-[var(--color-primary)]">
                        AF
                      </span>
                      <span className="text-[10px] text-[var(--color-muted)]">
                        Andre Foster
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-muted)]">
                    Boise → Twin Falls
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-[var(--color-muted)]">
                      <span className="text-[10px]">◷</span>
                      <span className="text-[10px]">1h 48m</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex rounded-md bg-[var(--color-primary-light)] px-2 py-1 text-[8px] font-semibold text-[var(--color-primary)]">
                      • On route
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-muted)]">
                    47 min ago
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
