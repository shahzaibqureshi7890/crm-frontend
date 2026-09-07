import { apiClient } from "@/lib/api-client";
import type { ProfileResponse } from "@/types/user.types";

export const getCurrentUser = async (): Promise<ProfileResponse> => {
  return apiClient<ProfileResponse>("/users/profile", {
    method: "GET",
  });
};
