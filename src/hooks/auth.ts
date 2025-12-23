import axios from "axios";


const API_URL = " https://benkyo.live/";


export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post<LoginResponse>("api/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "An error occurred!";
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};