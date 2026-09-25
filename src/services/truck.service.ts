import { apiClient } from "@/lib/api-client";
import type {
  CreateTruckData,
  TruckWithGallery,
  UpdateTruckData,
} from "@/types/truck.types";
interface GetTrucksResponse {
  success: boolean;
  trucks: TruckWithGallery[];
}
interface GetTruckResponse {
  success: boolean;
  truck: TruckWithGallery;
}
interface CreateTruckResponse {
  success: boolean;
  message: string;
  truck: TruckWithGallery;
}
interface UpdateTruckResponse {
  success: boolean;
  message: string;
  truck: TruckWithGallery;
}
interface DeleteTruckResponse {
  success: boolean;
  message: string;
}
interface DeleteGalleryImageResponse {
  success: boolean;
  message: string;
  truck: TruckWithGallery;
}
export const getTrucks = async (): Promise<GetTrucksResponse> => {
  return apiClient<GetTrucksResponse>("/trucks", {
    method: "GET",
  });
};
export const getTruck = async (truckId: number): Promise<GetTruckResponse> => {
  return apiClient<GetTruckResponse>(`/trucks/${truckId}`, {
    method: "GET",
  });
};
export const createTruck = async (
  truckData: CreateTruckData,
  featuredImage?: File,
  galleryImages: File[] = [],
): Promise<CreateTruckResponse> => {
  const formData = new FormData();
  formData.append("name", truckData.name);
  formData.append("year", String(truckData.year));
  if (featuredImage) {
    formData.append("featuredImage", featuredImage);
  }
  for (const image of galleryImages) {
    formData.append("galleryImages", image);
  }
  return apiClient<CreateTruckResponse>("/trucks", {
    method: "POST",
    body: formData,
  });
};
export const updateTruck = async (
  truckId: number,
  truckData: UpdateTruckData,
  featuredImage?: File,
  galleryImages: File[] = [],
): Promise<UpdateTruckResponse> => {
  const formData = new FormData();
  formData.append("name", truckData.name);
  formData.append("year", String(truckData.year));
  if (featuredImage) {
    formData.append("featuredImage", featuredImage);
  }
  for (const image of galleryImages) {
    formData.append("galleryImages", image);
  }
  return apiClient<UpdateTruckResponse>(`/trucks/${truckId}`, {
    method: "PUT",
    body: formData,
  });
};
export const deleteTruck = async (
  truckId: number,
): Promise<DeleteTruckResponse> => {
  return apiClient<DeleteTruckResponse>(`/trucks/${truckId}`, {
    method: "DELETE",
  });
};
export const deleteTruckGalleryImage = async (
  truckId: number,
  imageId: number,
): Promise<DeleteGalleryImageResponse> => {
  return apiClient<DeleteGalleryImageResponse>(
    `/trucks/${truckId}/gallery/${imageId}`,
    {
      method: "DELETE",
    },
  );
};
