import { apiClient } from "./api.client";
import { GetASingleRestaurant, Restaurant } from "../types/restaurants";

export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await apiClient.get<{ data: Restaurant[] }>(
      "/restaurants",
    );
    return response.data.data;
  } catch {
    return [];
  }
};

export const getFilteredRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await apiClient.get<{ data: Restaurant[] }>(
      "/restaurants",
    );
    return response.data.data;
  } catch {
    return [];
  }
};

export const getSingleRestaurant = async (orgId: string) => {
  try {
    const response = await apiClient.get<GetASingleRestaurant>(
      `/restaurants/${encodeURIComponent(orgId)}`,
    );
    return response.data.data;
  } catch {
    return null;
  }
};
