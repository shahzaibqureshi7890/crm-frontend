import { apiClient } from "@/lib/api-client";

import type {
  CreateDriverData,
  Driver,
  UpdateDriverData,
} from "@/types/driver.types";

interface GetDriversResponse {
  success: boolean;
  drivers: Driver[];
}

interface GetDriverResponse {
  success: boolean;
  driver: Driver;
}

interface CreateDriverResponse {
  success: boolean;
  message: string;
  driver: Driver;
}

interface UpdateDriverResponse {
  success: boolean;
  message: string;
  driver: Driver;
}

interface DeleteDriverResponse {
  success: boolean;
  message: string;
}

export const getDrivers = async (): Promise<GetDriversResponse> => {
  return apiClient<GetDriversResponse>("/drivers", {
    method: "GET",
  });
};

export const getDriver = async (
  driverId: number,
): Promise<GetDriverResponse> => {
  return apiClient<GetDriverResponse>(`/drivers/${driverId}`, {
    method: "GET",
  });
};

export const createDriver = async (
  driverData: CreateDriverData,
  profileImage?: File,
): Promise<CreateDriverResponse> => {
  const formData = new FormData();

  formData.append(
    "truckId",
    driverData.truckId === null ? "" : String(driverData.truckId),
  );

  formData.append("name", driverData.name);

  formData.append("email", driverData.email ?? "");

  formData.append("phone", driverData.phone);

  formData.append("licenseNumber", driverData.licenseNumber);

  formData.append("licenseExpiry", driverData.licenseExpiry ?? "");

  formData.append("status", driverData.status);

  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  return apiClient<CreateDriverResponse>("/drivers", {
    method: "POST",
    body: formData,
  });
};

export const updateDriver = async (
  driverId: number,
  driverData: UpdateDriverData,
  profileImage?: File,
): Promise<UpdateDriverResponse> => {
  const formData = new FormData();

  formData.append(
    "truckId",
    driverData.truckId === null ? "" : String(driverData.truckId),
  );

  formData.append("name", driverData.name);

  formData.append("email", driverData.email ?? "");

  formData.append("phone", driverData.phone);

  formData.append("licenseNumber", driverData.licenseNumber);

  formData.append("licenseExpiry", driverData.licenseExpiry ?? "");

  formData.append("status", driverData.status);

  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  return apiClient<UpdateDriverResponse>(`/drivers/${driverId}`, {
    method: "PUT",
    body: formData,
  });
};

export const deleteDriver = async (
  driverId: number,
): Promise<DeleteDriverResponse> => {
  return apiClient<DeleteDriverResponse>(`/drivers/${driverId}`, {
    method: "DELETE",
  });
};
