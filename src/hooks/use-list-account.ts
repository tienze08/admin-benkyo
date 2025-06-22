import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export interface UserAccount {
  id: string
  name: string
  email: string
  avatar?: string
  isPro: boolean
  proExpiryDate?: string
  createdAt: string
  role: "user" | "admin"
}

export function useAccounts() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return useQuery<UserAccount[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await api.get<any[]>("api/user/listAccounts", {
        headers: {
          Authorization: token, 
        },
      });

      const data = response.data;

      return data.map(
        (item): UserAccount => ({
          id: item.id,
          name: item.name,
          email: item.email,
          avatar: item.avatar,
          isPro: item.isPro,
          proExpiryDate: item.proExpiryDate,
          createdAt: item.createdAt,
          role: item.role,
        })
      );
    },
  });
}

