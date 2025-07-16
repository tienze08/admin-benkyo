import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export interface AccountStats {
  totalAccounts: number
  newAccountsThisMonth: number
  growthPercentage: number
}

export function useAccountStats() {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No token found")

  return useQuery<AccountStats>({
    queryKey: ["account-stats"],
    queryFn: async () => {
      const response = await api.get<AccountStats>("api/user/accountStats", {
        headers: {
          Authorization: token,
        },
      })
      return response.data
    },
  })
}
