import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function usePackages() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return useQuery<Package[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      const response = await api.get<any[]>("api/package", {
        headers: {
          Authorization: token,
        },
      });

      const data = response.data;

      return data.map(
        (item): Package => ({
          id: item.id,
          name: item.name,
          type: item.type,
          duration: item.duration,
          price: item.price,
          features: item.features,
          isActive: item.isActive,
          createdAt: item.createdAt,
        })
      );
    },
  });
}
