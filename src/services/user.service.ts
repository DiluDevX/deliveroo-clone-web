import { apiClient } from "./api.client";
import { isAxiosError } from "axios";
import { UserProfile, Address } from "../types/user.types";
import { getAuthHeader } from "./auth-headers";

const DUMMY_USER: UserProfile = {
  id: "user_001",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "07123456789",
  role: "user",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  if (import.meta.env.VITE_BYPASS_AUTH === "true") {
    return DUMMY_USER;
  }

  try {
    const response = await apiClient.get<{ success: boolean; data: UserProfile }>(
      "/users/me",
      { headers: getAuthHeader() },
    );
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

export const updateUserProfile = async (
  data: Partial<UserProfile>,
): Promise<UserProfile | null> => {
  if (import.meta.env.VITE_BYPASS_AUTH === "true") {
    return { ...DUMMY_USER, ...data };
  }

  try {
    const response = await apiClient.patch<{ success: boolean; data: UserProfile }>(
      "/users/me",
      data,
      { headers: getAuthHeader() },
    );
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error updating profile:", error.response?.data);
    }
    return null;
  }
};

export const deleteUserAccount = async (): Promise<boolean> => {
  if (import.meta.env.VITE_BYPASS_AUTH === "true") {
    return true;
  }

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

export const getUserAddresses = async (): Promise<Address[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: Address[] }>(
      "/addresses",
      { headers: getAuthHeader() },
    );
    return response.data.data || [];
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching addresses:", error.response?.data);
    }
    return [];
  }
};

export const addAddress = async (
  address: Omit<Address, "id">,
): Promise<Address | null> => {
  try {
    const response = await apiClient.post<{ success: boolean; data: Address }>(
      "/addresses",
      address,
      { headers: getAuthHeader() },
    );
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error adding address:", error.response?.data);
    }
    return null;
  }
};

export const updateAddress = async (
  id: string,
  address: Partial<Address>,
): Promise<Address | null> => {
  try {
    const response = await apiClient.patch<{ success: boolean; data: Address }>(
      `/addresses/${id}`,
      address,
      { headers: getAuthHeader() },
    );
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error updating address:", error.response?.data);
    }
    return null;
  }
};

export const deleteAddress = async (id: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/addresses/${id}`, { headers: getAuthHeader() });
    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error deleting address:", error.response?.data);
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
