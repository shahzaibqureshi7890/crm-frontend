import { apiClient } from "@/lib/api-client";

import type { GetDashboardCountsResponse } from "@/types/dashboard.types";

export const getDashboardCounts =
  async (): Promise<GetDashboardCountsResponse> => {
    return apiClient<GetDashboardCountsResponse>("/dashboard/counts", {
      method: "GET",
    });
  };
