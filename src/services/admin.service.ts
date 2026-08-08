import axios from "axios";
import {
  ProvisionRestaurantRequestBodyDTO,
  ProvisionRestaurantRequestBodySchema,
} from "../types/dto/admin.dto";
import { Restaurant } from "../types/restaurants";
import { apiClient } from "./api.client";

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

export const provisionRestaurant = async (
  input: ProvisionRestaurantRequestBodyDTO,
): Promise<Restaurant> => {
  const payload = ProvisionRestaurantRequestBodySchema.parse(input);

  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: { restaurant: Restaurant };
    }>("/admin/restaurants", payload);

    return response.data.data.restaurant;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;
      if (typeof data === "object" && data !== null && "message" in data) {
        const message = data.message;
        if (typeof message === "string") {
          throw new Error(message);
        }
      }
    }
    throw error;
  }
};
