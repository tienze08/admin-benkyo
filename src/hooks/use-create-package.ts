
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface NewPackage {
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
}

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  return useMutation({
    mutationFn: async (newPackage: NewPackage) => {
      const response = await api.post("api/package", newPackage, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};
