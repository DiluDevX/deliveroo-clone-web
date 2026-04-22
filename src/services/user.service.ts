import axios, { isAxiosError } from "axios";
import { UserProfile, Address } from "../types/user.types";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "x-api-key": import.meta.env.VITE_BFF_API_KEY || "your-bff-api-key",
  };
};

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
    const response = await axios.get<{ success: boolean; data: UserProfile }>(
      "/api/users/me",
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
    const response = await axios.patch<{ success: boolean; data: UserProfile }>(
      "/api/users/me",
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
    await axios.delete(`/api/users/${userId}`, { headers: getAuthHeader() });
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
    await axios.post(
      "/api/auth/change-password",
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
    const response = await axios.get<{ success: boolean; data: Address[] }>(
      "/api/addresses",
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
    const response = await axios.post<{ success: boolean; data: Address }>(
      "/api/addresses",
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
    const response = await axios.patch<{ success: boolean; data: Address }>(
      `/api/addresses/${id}`,
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
    await axios.delete(`/api/addresses/${id}`, { headers: getAuthHeader() });
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
    const response = await axios.patch(`/api/users/${user_id}`, {
      password,
    });
    if (!response) {
      return new Error("Failed to update password");
    }
    return { message: "Password updated successfully" };
  } catch (error) {
    console.error("Error updating password", error);
    return new Error("Failed to update password");
  }
};
