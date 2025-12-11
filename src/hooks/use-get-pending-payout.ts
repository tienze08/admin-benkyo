import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface UserInfo {
  name: string;
  email: string;
}

export interface Payout {
  bankAbbreviation?: string;
  accountNumber?: string;
  accountName?: string;
  branch?: string;
  requestedAt?: string;
  paidAt?: string;
  rejectReason?: string;
  paymentRef?: string;
  proofUrl?: string;
  processedAt?: string;
}

export interface PendingPayout {
  _id: string;
  user: UserInfo;
  amount: number;
  status: string;
  createdAt: string;
  payout: Payout;
}

export function usePendingPayout() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return useQuery<PendingPayout[]>({
    queryKey: ["pendingPayout"],
    queryFn: async () => {
      const response = await api.get<PendingPayout[]>("api/payment/payout/latest", {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    },
  });
}
