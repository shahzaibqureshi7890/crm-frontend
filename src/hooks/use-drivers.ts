"use client";

import { useCallback, useState } from "react";

import {
  createDriver as createDriverService,
  deleteDriver as deleteDriverService,
  getDriver as getDriverService,
  getDrivers as getDriversService,
  updateDriver as updateDriverService,
} from "@/services/driver.service";

import type {
  CreateDriverData,
  Driver,
  UpdateDriverData,
} from "@/types/driver.types";

import { showAppToast } from "@/components/ui/app-toast";

import { useDashboardCounts } from "@/hooks/use-dashboard-counts";

interface UseDriversResult {
  drivers: Driver[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchDrivers: () => Promise<void>;
  fetchDriver: (driverId: number) => Promise<Driver | null>;

  createDriver: (
    driverData: CreateDriverData,
    profileImage?: File,
  ) => Promise<Driver>;

  updateDriver: (
    driverId: number,
    driverData: UpdateDriverData,
    profileImage?: File,
  ) => Promise<Driver>;

  deleteDriver: (driverId: number) => Promise<void>;
}

export const useDrivers = (): UseDriversResult => {
  const { refreshDashboardCounts } = useDashboardCounts();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDriversService();

      setDrivers(response.drivers);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load drivers.";

      setError(message);
      showAppToast("error", message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDriver = useCallback(async (driverId: number) => {
    setError(null);

    try {
      const response = await getDriverService(driverId);

      return response.driver;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load driver.";

      setError(message);
      showAppToast("error", message);

      return null;
    }
  }, []);

  const createDriver = useCallback(
    async (
      driverData: CreateDriverData,
      profileImage?: File,
    ): Promise<Driver> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await createDriverService(driverData, profileImage);

        setDrivers((currentDrivers) => [response.driver, ...currentDrivers]);

        await refreshDashboardCounts();

        showAppToast("success", response.message);

        return response.driver;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create driver.";

        setError(message);
        showAppToast("error", message);

        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshDashboardCounts],
  );

  const updateDriver = useCallback(
    async (
      driverId: number,
      driverData: UpdateDriverData,
      profileImage?: File,
    ): Promise<Driver> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await updateDriverService(
          driverId,
          driverData,
          profileImage,
        );

        setDrivers((currentDrivers) =>
          currentDrivers.map((driver) =>
            driver.id === driverId ? response.driver : driver,
          ),
        );

        showAppToast("success", response.message);

        return response.driver;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update driver.";

        setError(message);
        showAppToast("error", message);

        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const deleteDriver = useCallback(
    async (driverId: number): Promise<void> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await deleteDriverService(driverId);

        setDrivers((currentDrivers) =>
          currentDrivers.filter((driver) => driver.id !== driverId),
        );

        await refreshDashboardCounts();

        showAppToast("success", response.message);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete driver.";

        setError(message);
        showAppToast("error", message);

        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshDashboardCounts],
  );

  return {
    drivers,
    isLoading,
    isSubmitting,
    error,
    fetchDrivers,
    fetchDriver,
    createDriver,
    updateDriver,
    deleteDriver,
  };
};
