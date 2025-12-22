import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface PackageDistributionItem {
  name: string;
  value: number;
}

export interface PackageDistributionData {
  year: number;
  data: PackageDistributionItem[];
}

export interface PackageDistributionAPIResponse {
  success: boolean;
  data: PackageDistributionData;
}


export function usePackageDistribution(year?: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return useQuery<PackageDistributionAPIResponse>({
    queryKey: ["packageDistribution", year],
    queryFn: async () => {
      const response = await api.get<PackageDistributionAPIResponse>(
        "api/payment/dashboard-package",
        {
          params: { year },
          headers: { Authorization: token },
        }
      );
      return response.data;
    },
    staleTime: 0,
    refetchInterval: 5000,
  });
}
