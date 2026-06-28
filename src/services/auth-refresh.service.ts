import axios from "axios";
import { CommonResponseDTO } from "../types/common";
import { getStoredRefreshToken } from "./auth-headers";

export type RefreshTokenPayload = {
  accessToken: string;
  refreshToken: string;
};

type RefreshTokenApiResponse =
  | CommonResponseDTO<RefreshTokenPayload>
  | RefreshTokenPayload;

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_BFF_API_URL || "/api",
  withCredentials: true,
  headers: {
    "x-api-key": import.meta.env.VITE_BFF_API_KEY,
  },
});

export const refreshAccessToken =
  async (): Promise<RefreshTokenPayload | null> => {
    const storedRefreshToken = getStoredRefreshToken();
    if (!storedRefreshToken) {
      return null;
    }

    const response = await refreshClient.post<RefreshTokenApiResponse>(
      "/auth/refresh",
      {
        refreshToken: storedRefreshToken,
      },
    );
    const payload =
      response.data && "data" in response.data
        ? response.data.data
        : response.data;

    if (!payload.accessToken || !payload.refreshToken) {
      return null;
    }

    return payload;
  };
