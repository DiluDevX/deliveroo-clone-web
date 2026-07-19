import { isAxiosError } from "axios";

type ApiErrorBody = {
  message?: unknown;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (!isAxiosError<ApiErrorBody>(error)) return fallback;

  const message = error.response?.data?.message;
  return typeof message === "string" && message.trim() ? message : fallback;
};
