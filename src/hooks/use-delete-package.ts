// hooks/use-delete-package.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  return useMutation({
    mutationFn: async (packageId: string) => {
      await api.delete(`api/package/${packageId}`, {
        headers: {
          Authorization: token,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};
