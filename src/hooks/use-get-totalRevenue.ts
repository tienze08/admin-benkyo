// src/hooks/use-get-totalRevenue.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface RevenueStats {
  totalRevenue: number;
  totalRevenueChange: number;

  packageRevenue: number;
  topupRevenue: number;
  payoutRevenue: number;

  monthlyAverage: number;
  monthlyAverageChange: number;

  arpu: number;
  arpuChange: number;

  mrr: number;
  mrrChange: number;
}



export function useDashboardMetrics(year: string) {
  return useQuery<RevenueStats>({
    queryKey: ["dashboard-metrics", year],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await api.get<RevenueStats>(
        `api/payment/getDashboardMetrics?year=${year}`,
        {
          headers: { Authorization: token },
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!year,
  });
}
