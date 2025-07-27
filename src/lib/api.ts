import axios from "axios";

const API_URL = "https://benkyo.live/";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});