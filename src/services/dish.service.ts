import axios from "axios";
import { IDish } from "../data/Sides";
export const getDishes = async (categoryId: string): Promise<IDish[]> => {
  try {
    const response = await axios.get(`/api/dishes?category=${categoryId}`);
    if (!response.data) {
      throw new Error("Failed to fetch categories.");
    }
    const result = await response.data;

    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("Error fetching categories.", error);
    return [];
  }
};
