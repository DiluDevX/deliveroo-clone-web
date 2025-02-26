import axios from "axios";
import { ICategory } from "../data/Sides";

export const getCategories = async (): Promise<ICategory[]> => {
  try {
    const response = await axios.get(
      `/api/categories?restaurant=${localStorage.getItem("id")}`,
    );
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
