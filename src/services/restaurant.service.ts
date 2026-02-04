import axios from "axios";
import { GetASingleRestaurant, Restaurant } from "../types/restaurants";
export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await axios.get("/api/restaurants");
    if (!response.data) {
      throw new Error("Failed to fetch all Restaurants.");
    }
    const data = await response.data;
    return data.data;
  } catch (error) {
    console.error("Error fetching all Restaurants.", error);
    return [];
  }
};

export const getFilteredRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await axios.get("/api/restaurants");
    if (!response.data) {
      throw new Error("Failed to fetch filtered Restaurants.");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching filtered Restaurants:", error);
    return [];
  }
};
export const getSingleRestaurant = async (orgId: string) => {
  try {
    const response = await axios.get(
      `/api/restaurants/${encodeURIComponent(orgId)}`,
    );

    if (!response.data) {
      throw new Error("Restaurant not found");
    }
    const data: GetASingleRestaurant = await response.data;
    return data.data;
  } catch (error) {
    console.error("Error fetching Restaurant", error);
    return null;
  }
};

export const createRestaurant = async (
  restaurantData: Partial<Restaurant>,
): Promise<Restaurant> => {
  try {
    const response = await axios.post("/api/restaurants", restaurantData);
    if (!response.data) {
      throw new Error("Failed to create restaurant.");
    }
    const data: Restaurant = await response.data.data;
    return data;
  } catch (error) {
    console.error("Error creating restaurant.", error);
    throw error;
  }
};
