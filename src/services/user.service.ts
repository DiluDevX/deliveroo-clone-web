import { apiClient } from "./api.client";

export const UpdateUserPassword = async ({
  password,
  user_id,
}: {
  password: string;
  user_id: string;
}) => {
  try {
    await apiClient.patch(`/users/${user_id}`, {
      password,
    });
    return { message: "Password updated successfully" };
  } catch {
    return new Error("Failed to update password");
  }
};
