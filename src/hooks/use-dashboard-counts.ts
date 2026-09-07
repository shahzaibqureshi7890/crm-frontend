"use client";

import { useDashboardCountsContext } from "@/context/dashboard-counts-context";

export const useDashboardCounts = () => {
  return useDashboardCountsContext();
};
