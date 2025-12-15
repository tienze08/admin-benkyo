import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface MonthlyRevenue {
  name: string;
  revenue: number;
}

export function useMonthlyRevenue(year?: string) {
  return useQuery<MonthlyRevenue[]>({
    queryKey: ["monthlyRevenue", year],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Unauthorized: No token");
      }

      const res = await api.get(
        "/api/payment/monthlyRevenue",
        {
          params: { year },
          headers: {
            Authorization: token,
          },
        }
      );

      return res.data as MonthlyRevenue[];
    },
    enabled: Boolean(year && localStorage.getItem("token")),
    staleTime: 1000 * 60 * 5, 
  });
}
