import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DashboardCountsProvider } from "@/context/dashboard-counts-context";

interface DashboardRouteLayoutProps {
  children: React.ReactNode;
}

export default function DashboardRouteLayout({
  children,
}: DashboardRouteLayoutProps) {
  return (
    <DashboardCountsProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </DashboardCountsProvider>
  );
}
