import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface RawQuarterlyRevenueItem {
  name: string;
  Basic?: number;
  Pro?: number;
  Premium?: number;
}

export interface QuarterlyRevenueItem {
  name: string;
  basic: number;
  pro: number;
  premium: number;
}

export function useQuarterlyRevenue(year: string) {
  return useQuery<QuarterlyRevenueItem[]>({
    queryKey: ["quarterly-revenue", year],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await api.get<RawQuarterlyRevenueItem[]>(
        `api/payment/quarterlyRevenue?year=${year}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      return response.data.map((item) => ({
        name: item.name,
        basic: item.Basic ?? 0,
        pro: item.Pro ?? 0,
        premium: item.Premium ?? 0,
      }));
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!year,
  });
}
