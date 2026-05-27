import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BFF_API_URL || "/api",
  withCredentials: true,
  headers: {
    "x-api-key": import.meta.env.VITE_BFF_API_KEY,
  },
});

export default apiClient;
