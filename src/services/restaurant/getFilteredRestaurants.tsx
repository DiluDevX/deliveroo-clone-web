import axios from "axios";
import { FilteredRestaurant } from "../../types/restaurants";

interface CheckFilteredRestaurantsResponse {
  data: FilteredRestaurant[];
}

export const getFilteredRestaurants = async (): Promise<
  FilteredRestaurant[]
> => {
  try {
    const response =
      await axios.get<CheckFilteredRestaurantsResponse>("/api/restaurants/");
    if (!response.data) {
      throw new Error("Failed to fetch filtered Restaurants.");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching filtered Restaurants:", error);
    return [];
  }
};
