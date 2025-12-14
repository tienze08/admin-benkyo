import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface RejectPayload {
  transactionId: string;
  reason: string;
}

export function useRejectPayout() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  return useMutation({
    mutationFn: async ({ transactionId, reason }: RejectPayload) => {
      const res = await api.post(
        "api/payment/payout/reject",
        { transactionId, reason },
        {
          headers: {
            Authorization: token!,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingPayout"] });
      queryClient.invalidateQueries({ queryKey: ["payoutHistory"] });
    },
  });
}
