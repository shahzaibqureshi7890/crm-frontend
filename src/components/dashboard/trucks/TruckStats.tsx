"use client";

import type { TruckWithGallery } from "@/types/truck.types";

interface TruckStatsProps {
  trucks: TruckWithGallery[];
}

export default function TruckStats({ trucks }: TruckStatsProps) {
  const totalTrucks = trucks.length;

  const totalGalleryImages = trucks.reduce(
    (total, truck) => total + truck.gallery.length,
    0,
  );

  const stats = [
    {
      label: "Total Trucks",
      value: totalTrucks,
    },
    {
      label: "Featured Images",
      value: totalTrucks,
    },
    {
      label: "Gallery Images",
      value: totalGalleryImages,
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
