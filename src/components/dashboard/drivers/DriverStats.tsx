"use client";

import type { Driver } from "@/types/driver.types";

interface DriverStatsProps {
  drivers: Driver[];
}

export default function DriverStats({ drivers }: DriverStatsProps) {
  const totalDrivers = drivers.length;

  const activeDrivers = drivers.filter(
    (driver) => driver.status === "active",
  ).length;

  const assignedDrivers = drivers.filter(
    (driver) => driver.truckId !== null,
  ).length;

  const stats = [
    {
      label: "Total Drivers",
      value: totalDrivers,
    },
    {
      label: "Active Drivers",
      value: activeDrivers,
    },
    {
      label: "Assigned Drivers",
      value: assignedDrivers,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm"
        >
          <p className="text-xs font-medium text-[var(--color-muted)]">
            {stat.label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
