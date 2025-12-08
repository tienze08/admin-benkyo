// src/hooks/use-get-monthlyRevenue.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface MonthlyRevenue {
  name: string; 
  revenue: number;
}

export function useMonthlyRevenue(year: string) {
  return useQuery({
    queryKey: ["monthlyRevenue", year],   
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await api.get(`api/payment/monthlyRevenue?year=${year}`, {
        headers: { Authorization: token },
      });
      return res.data;
    },
    enabled: !!year,
  });
}

