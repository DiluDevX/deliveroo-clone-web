import { apiClient } from "./api.client";
import { isAxiosError } from "axios";
import { Address, UserProfile, IUser } from "../types/user.types";
import { getAuthHeader } from "./auth-headers";

export type AddressPayload = {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country?: string;
  instructions?: string;
  isDefault?: boolean;
};

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

export const getUserAddresses = async (): Promise<Address[]> => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      data: Address[];
    }>("/users/me/addresses", { headers: getAuthHeader() });

    return response.data.data || [];
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching addresses:", error.response?.data);
    }
    return [];
  }
};

export const createUserAddress = async (
  data: AddressPayload,
): Promise<Address | null> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      data: Address;
    }>("/users/me/addresses", data, { headers: getAuthHeader() });

    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error creating address:", error.response?.data);
    }
    return null;
  }
};

export const updateUserAddress = async (
  addressId: string,
  data: Partial<AddressPayload>,
): Promise<Address | null> => {
  try {
    const response = await apiClient.patch<{
      success: boolean;
      data: Address;
    }>(`/users/me/addresses/${addressId}`, data, { headers: getAuthHeader() });

    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error updating address:", error.response?.data);
    }
    return null;
  }
};

export const deleteUserAddress = async (
  addressId: string,
): Promise<boolean> => {
  try {
    await apiClient.delete(`/users/me/addresses/${addressId}`, {
      headers: getAuthHeader(),
    });
    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error deleting address:", error.response?.data);
    }
    return false;
  }
};

export const setDefaultUserAddress = async (
  addressId: string,
): Promise<Address | null> => {
  try {
    const response = await apiClient.patch<{
      success: boolean;
      data: Address;
    }>(
      `/users/me/addresses/${addressId}/default`,
      {},
      { headers: getAuthHeader() },
    );

    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error setting default address:", error.response?.data);
    }
    return null;
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
