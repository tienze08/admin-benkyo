import { useEffect, useState } from "react";
import axios from "axios";


const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export interface Account {
  id: string;
  name: string;
  email: string;
  role: string;
  isPro?: boolean;
  avatar?: string;
  createdAt?: string;
  proExpiryDate?: string | null;
}


export const useListAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized. Please login.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<Account[]>("/api/user/listAccounts");
        setAccounts(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "An error occurred while fetching accounts."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return { accounts, loading, error };
};
