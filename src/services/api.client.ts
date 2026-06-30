import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { logOut, setCredentials } from "../store/authSlice";
import { store } from "../store/store";
import { getStoredAccessToken } from "./auth-headers";
import {
  refreshAccessToken,
  RefreshTokenPayload,
} from "./auth-refresh.service";

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshRequest: Promise<RefreshTokenPayload | null> | null = null;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BFF_API_URL || "/api",
  withCredentials: true,
  headers: {
    "x-api-key": import.meta.env.VITE_BFF_API_KEY,
  },
});

apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);
  const accessToken = getStoredAccessToken();

  headers.set("x-api-key", import.meta.env.VITE_BFF_API_KEY);

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  config.headers = headers;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) {
      throw new Error("An unexpected error occurred. Please try again later.");
    }

    const originalRequest = error.config as RetryRequestConfig;
    const status = error.response?.status;
    const requestUrl = originalRequest.url ?? "";

    if (
      status !== 401 ||
      originalRequest._retry ||
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout")
    ) {
      throw error;
    }

    originalRequest._retry = true;

    try {
      refreshRequest ??= refreshAccessToken();
      const refreshedTokens = await refreshRequest;
      refreshRequest = null;

      if (!refreshedTokens) {
        store.dispatch(logOut());
        throw new Error(
          "An unexpected error occurred. Please try again later.",
        );
      }

      store.dispatch(
        setCredentials({
          accessToken: refreshedTokens.accessToken,
          refreshToken: refreshedTokens.refreshToken,
        }),
      );

      const headers = AxiosHeaders.from(originalRequest.headers);
      headers.set("Authorization", `Bearer ${refreshedTokens.accessToken}`);
      headers.set("x-api-key", import.meta.env.VITE_BFF_API_KEY);
      originalRequest.headers = headers;

      return apiClient(originalRequest);
    } catch {
      refreshRequest = null;
      store.dispatch(logOut());
      throw error;
    }
  },
);

export default apiClient;
