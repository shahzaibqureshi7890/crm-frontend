import { apiClient } from "@/lib/api-client";

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  user: AuthUser;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export const registerUser = async (
  data: RegisterRequest,
): Promise<AuthResponse> => {
  return apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  return apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  return apiClient<LogoutResponse>("/auth/logout", {
    method: "POST",
  });
};
