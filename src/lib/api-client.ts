const isProduction = process.env.NODE_ENV === "production";
// Agar production mein hain toh relative path ("/api") use hoga jo Next.js rewrites ke zariye proxy karega.
// Local development mein localhost use hoga.
const BASE_URL = isProduction
  ? ""
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE_URL = isProduction
  ? "/api"
  : BASE_URL.endsWith("/api")
    ? BASE_URL
    : `${BASE_URL}/api`;
type ApiErrorResponse = {
  success?: boolean;
  message?: string;
};
export class ApiError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const headers = new Headers(options.headers);
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });
  let data: T | ApiErrorResponse | null = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null;
    throw new ApiError(
      errorData?.message || "Something went wrong. Please try again.",
      response.status,
    );
  }
  return data as T;
};
