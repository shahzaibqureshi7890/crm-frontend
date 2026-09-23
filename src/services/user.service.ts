import { apiClient } from "@/lib/api-client";
import type { ProfileResponse, UsersResponse } from "@/types/user.types";

export const getCurrentUser = async (): Promise<ProfileResponse> => {
  return apiClient<ProfileResponse>("/users/profile", {
    method: "GET",
  });
};

export const getUsers = async (): Promise<UsersResponse> => {
  return apiClient<UsersResponse>("/users", {
    method: "GET",
  });
};
