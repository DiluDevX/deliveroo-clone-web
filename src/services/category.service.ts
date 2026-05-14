import { apiClient } from "./api.client";
import { ICategory } from "../data/Sides";

export const getCategories = async (): Promise<ICategory[]> => {
  try {
    const restaurantId = localStorage.getItem("id");

    const response = await apiClient.get<{ data: ICategory[] }>(
      `/categories?restaurant=${restaurantId}`,
    );

    const data = response.data.data || response.data;
    const categories = Array.isArray(data) ? data : [];
    return categories;
  } catch {
    return [];
  }
};
