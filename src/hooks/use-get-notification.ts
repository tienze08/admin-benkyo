
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface PublicDeckRequestNotificationType {
  notificationType: 'public_deck_request';
  sortTime: Date;
  priority: number;
  id: string;
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  deckId: string;
  deckTitle: string;
  message: string;
  isRead: boolean;
}

export function usePublicDeckRequestNotifications(hiddenIds: string[] = [], enabled: boolean = true) {
  return useQuery({
    queryKey: ['notifications', hiddenIds],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await api.get<{ all: PublicDeckRequestNotificationType[] }>(
  "api/deck/notifications",
  {
    headers: { Authorization: token },
    params: { hiddenIds: hiddenIds.join(',') },
  }
);

      return res.data.all;
    },
    enabled
  });
}
