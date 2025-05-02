import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FlashcardDeckRequest, RequestStatus } from "@/lib/types";

export function useRequests() {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // 👈 Log token để kiểm tra
    if (!token) throw new Error("No token found");

  return useQuery<FlashcardDeckRequest[]>({
    queryKey: ["requests"],
    queryFn: async () => {
        
      const response = await api.get<any[]>("api/decks/public-requests", {
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = response.data;

      return data.map((item): FlashcardDeckRequest => ({
        id: item._id,
        title: item.name,
        description: item.description,
        cardsCount: item.cardCount,
        creator: {
          id: item.owner._id,
          name: item.owner.name,
          avatar: item.owner.avatar || undefined,
        },
        status: item.publicStatus as RequestStatus,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    },
  });
}
