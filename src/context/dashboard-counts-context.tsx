"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getDashboardCounts } from "@/services/dashboard.service";

import type { DashboardCounts } from "@/types/dashboard.types";

interface DashboardCountsContextValue {
  counts: DashboardCounts | null;
  isLoading: boolean;
  error: string | null;
  refreshDashboardCounts: () => Promise<void>;
}

const DashboardCountsContext =
  createContext<DashboardCountsContextValue | null>(null);

interface DashboardCountsProviderProps {
  children: React.ReactNode;
}

export function DashboardCountsProvider({
  children,
}: DashboardCountsProviderProps) {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const refreshDashboardCounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDashboardCounts();

      setCounts(response.counts);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load dashboard counts.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDashboardCounts();
  }, [refreshDashboardCounts]);

  return (
    <DashboardCountsContext.Provider
      value={{
        counts,
        isLoading,
        error,
        refreshDashboardCounts,
      }}
    >
      {children}
    </DashboardCountsContext.Provider>
  );
}

export const useDashboardCountsContext = (): DashboardCountsContextValue => {
  const context = useContext(DashboardCountsContext);

  if (!context) {
    throw new Error(
      "useDashboardCountsContext must be used within DashboardCountsProvider.",
    );
  }

  return context;
};
