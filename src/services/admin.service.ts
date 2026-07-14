import axios from "axios";
import { IUser } from "../types/user.types";

export const verifyApiKey = async (
  apiKey: string,
  email: string,
  password: string,
) => {
  try {
    const response = await axios.post("/api/admin/verify-api-key", {
      apiKey,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying API key", error);
    return false;
  }
};

export const updateRestaurantAdmin = async (
  userId: string,
  data: Partial<IUser>,
) => {
  const response = await axios.patch(
    `/api/auth/admin/update-partially/${userId}`,
    {
      data,
    },
  );
  return response.data.user;
};

export const createNewRestaurantAdmin = async (
  email: string,
  password: string,
  restaurantName: string,
  isPlatformAdmin: boolean,
): Promise<IUser> => {
  if (!isPlatformAdmin) {
    throw new Error("Platform admins can only create restaurant admins.");
  }
  const response = await axios.post(
    "/api/auth/admin/create-restaurant-admin",
    {
      email,
      password,
      role: "restaurant_user",
      restaurantRole: "super_admin",
      firstName: restaurantName,
      lastName: "admin",
    },
    {
      headers: {
        platform_admin: isPlatformAdmin ? "true" : "false",
      },
    },
  );

  return response.data.user;
};
