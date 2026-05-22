import { apiClient } from "./api.client";
import { isAxiosError } from "axios";
import { UserProfile, IUser } from "../types/user.types";
import { getAuthHeader } from "./auth-headers";

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      data: UserProfile;
    }>("/auth/me", { headers: getAuthHeader() });
    if (response.data.data?.id) {
      localStorage.setItem("userId", response.data.data.id);
    }
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching profile:", error.response?.data);
    }
    return null;
  }
};

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: IUser[] }>(
      "/users",
      { headers: getAuthHeader() },
    );
    return response.data.data || [];
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching users", {
        status: error.response?.status,
        message: error.message,
      });
    }
    throw new Error("Failed to fetch users");
  }
};

export const updateUserProfile = async (
  data: Partial<UserProfile>,
): Promise<UserProfile | null> => {
  try {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      const profile = await getUserProfile();
      userId = profile?.id ?? null;
    }

    if (!userId) {
      return null;
    }

    const response = await apiClient.patch<{
      success: boolean;
      data: UserProfile;
    }>(`/users/${userId}`, data, { headers: getAuthHeader() });
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error updating profile:", error.response?.data);
    }
    return null;
  }
};

export const deleteUserAccount = async (): Promise<boolean> => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return false;
  }

  try {
    await apiClient.delete(`/users/${userId}`, { headers: getAuthHeader() });
    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error deleting account:", error.response?.data);
    }
    return false;
  }
};

export const updatePassword = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}): Promise<boolean> => {
  try {
    await apiClient.post(
      "/auth/change-password",
      { currentPassword, newPassword },
      { headers: getAuthHeader() },
    );
    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error updating password:", error.response?.data);
    }
    return false;
  }
};

export const UpdateUserPassword = async ({
  password,
  user_id,
}: {
  password: string;
  user_id: string;
}): Promise<boolean> => {
  try {
    await apiClient.patch(
      `/users/${user_id}`,
      { password },
      { headers: getAuthHeader() },
    );
    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error updating user password:", error.response?.data);
    } else {
      console.error("Error updating user password:", error);
    }
    return false;
  }
};
