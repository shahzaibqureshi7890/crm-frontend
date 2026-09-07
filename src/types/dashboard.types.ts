export interface DashboardCounts {
  trucks: number;
  drivers: number;
}

export interface GetDashboardCountsResponse {
  success: boolean;
  counts: DashboardCounts;
}
