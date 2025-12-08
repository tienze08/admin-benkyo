import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export const useChangePassword = () => {
  const token = localStorage.getItem("token");

  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const response = await api.post("api/auth/changePassword", payload, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    },
  });
};
