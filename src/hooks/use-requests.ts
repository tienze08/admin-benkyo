import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FlashcardDeckRequest, RequestStatus } from "@/lib/types";

export function useRequests() {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
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

export function useRequestById(id: string) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    return useQuery<FlashcardDeckRequest>({
      queryKey: ["request", id],
      queryFn: async () => {
        const response = await api.get<any>(`api/decks/public-requests/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        const item = response.data;

        return {
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
          reviewedBy: item.reviewedBy || null,
          reviewNote: item.reviewNote || null,
          cards: item.cards || [],
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      },
    });
}

interface ReviewRequestInput {
  id: string;
  status: RequestStatus;
  note?: string;
}

export function useReviewRequest() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return useMutation({
    mutationFn: async ({ id, status, note }: ReviewRequestInput) => {
      const response = await api.patch<any>(`api/decks/public-requests/${id}`, 
        { status, note },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return response.data;
    },
  });
}

