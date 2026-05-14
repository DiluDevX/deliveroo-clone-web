import { apiClient } from "./api.client";

export const sendEmail = async (email: string) => {
  try {
    await apiClient.post("/auth/forgot-password", {
      email,
    });
    return { message: "Email sent successfully" };
  } catch {
    return new Error("Failed to send email");
  }
};
