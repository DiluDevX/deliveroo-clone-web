import { apiClient } from "./api.client";
import { IDish } from "../data/Sides";

export const getDishes = async (categoryId: string): Promise<IDish[]> => {
  try {
    const response = await apiClient.get<{ data: IDish[] }>(
      `/dishes?category=${categoryId}`,
    );
    const result = response.data;

    return Array.isArray(result.data) ? result.data : [];
  } catch {
    return [];
  }
};
