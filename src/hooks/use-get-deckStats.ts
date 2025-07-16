import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export interface DeckStats {
  totalDecks: number
  pendingDecks: number
  createdThisMonth: number
  growthPercentage: number
}

export function useDeckStats() {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No token found")

  return useQuery<DeckStats>({
    queryKey: ["deckStats"],
    queryFn: async () => {
      const response = await api.get<DeckStats>("api/decks/deckStats", {
        headers: {
          Authorization: token,
        },
      })
      return response.data
    },
  })
}
