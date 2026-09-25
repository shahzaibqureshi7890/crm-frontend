"use client";
import { useCallback, useState } from "react";
import {
  createTruck as createTruckService,
  deleteTruck as deleteTruckService,
  deleteTruckGalleryImage as deleteTruckGalleryImageService,
  getTruck as getTruckService,
  getTrucks as getTrucksService,
  updateTruck as updateTruckService,
} from "@/services/truck.service";
import type {
  CreateTruckData,
  TruckWithGallery,
  UpdateTruckData,
} from "@/types/truck.types";
import { showAppToast } from "@/components/ui/app-toast";
import { useDashboardCounts } from "@/hooks/use-dashboard-counts";
interface UseTrucksResult {
  trucks: TruckWithGallery[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  fetchTrucks: () => Promise<void>;
  fetchTruck: (truckId: number) => Promise<TruckWithGallery | null>;
  createTruck: (
    truckData: CreateTruckData,
    featuredImage?: File,
    galleryImages?: File[],
  ) => Promise<TruckWithGallery>;
  updateTruck: (
    truckId: number,
    truckData: UpdateTruckData,
    featuredImage?: File,
    galleryImages?: File[],
  ) => Promise<TruckWithGallery>;
  deleteTruck: (truckId: number) => Promise<void>;
  deleteGalleryImage: (
    truckId: number,
    imageId: number,
  ) => Promise<TruckWithGallery>;
}
export const useTrucks = (): UseTrucksResult => {
  const { refreshDashboardCounts } = useDashboardCounts();
  const [trucks, setTrucks] = useState<TruckWithGallery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchTrucks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTrucksService();
      setTrucks(response.trucks);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load trucks.";
      setError(message);
      showAppToast("error", message);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const fetchTruck = useCallback(async (truckId: number) => {
    setError(null);
    try {
      const response = await getTruckService(truckId);
      return response.truck;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load truck.";
      setError(message);
      showAppToast("error", message);
      return null;
    }
  }, []);
  const createTruck = useCallback(
    async (
      truckData: CreateTruckData,
      featuredImage?: File,
      galleryImages: File[] = [],
    ) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await createTruckService(
          truckData,
          featuredImage,
          galleryImages,
        );
        setTrucks((currentTrucks) => [response.truck, ...currentTrucks]);
        await refreshDashboardCounts();
        showAppToast("success", response.message);
        return response.truck;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create truck.";
        setError(message);
        showAppToast("error", message);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshDashboardCounts],
  );
  const updateTruck = useCallback(
    async (
      truckId: number,
      truckData: UpdateTruckData,
      featuredImage?: File,
      galleryImages: File[] = [],
    ) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await updateTruckService(
          truckId,
          truckData,
          featuredImage,
          galleryImages,
        );
        setTrucks((currentTrucks) =>
          currentTrucks.map((truck) =>
            truck.id === truckId ? response.truck : truck,
          ),
        );
        await refreshDashboardCounts(); // Added for consistency
        showAppToast("success", response.message);
        return response.truck;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update truck.";
        setError(message);
        showAppToast("error", message);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshDashboardCounts], // Added dependency here
  );
  const deleteTruck = useCallback(
    async (truckId: number) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await deleteTruckService(truckId);
        setTrucks((currentTrucks) =>
          currentTrucks.filter((truck) => truck.id !== truckId),
        );
        await refreshDashboardCounts();
        showAppToast("success", response.message);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete truck.";
        setError(message);
        showAppToast("error", message);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshDashboardCounts],
  );
  const deleteGalleryImage = useCallback(
    async (truckId: number, imageId: number) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await deleteTruckGalleryImageService(truckId, imageId);
        setTrucks((currentTrucks) =>
          currentTrucks.map((truck) =>
            truck.id === truckId ? response.truck : truck,
          ),
        );
        showAppToast("success", response.message);
        return response.truck;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete gallery image.";
        setError(message);
        showAppToast("error", message);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );
  return {
    trucks,
    isLoading,
    isSubmitting,
    error,
    fetchTrucks,
    fetchTruck,
    createTruck,
    updateTruck,
    deleteTruck,
    deleteGalleryImage,
  };
};
