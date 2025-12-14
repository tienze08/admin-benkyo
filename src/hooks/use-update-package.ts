
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api"; 

export interface UpdatePackageData {
  id: string;
  name: string;
  type: string;
  price: number;
  duration: string;
  features: string[];
}

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  return useMutation({
    mutationFn: async (data: UpdatePackageData) => {
      const { id, ...updateData } = data;

      const response = await api.put(`api/package/${id}`, updateData, {
        headers: {
          Authorization: token,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (error: any) => {
      console.error("Update package error:", error);
      alert(error?.message || "Update failed");
    },
  });
};
