import axios from "axios";

const API_URL = "https://benkyo.live/";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});