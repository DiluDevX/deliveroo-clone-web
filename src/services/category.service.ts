import axios from "axios";
import { ICategory } from "../data/Sides";

export const getCategories = async (): Promise<ICategory[]> => {
  try {
    const restaurantId = localStorage.getItem("id");

    const response = await axios.get(
      `/api/categories?restaurant=${restaurantId}`,
    );

    if (!response.data) {
      console.error("Category not found");
    }

    const data = response.data.data || response.data;
    const categories = Array.isArray(data) ? data : [];
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
