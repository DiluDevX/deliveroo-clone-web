import { apiClient } from "./api.client";

export type MenuCategory = {
  id: string;
  restaurantId: string;
  name: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type MenuDish = {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isVegetarian: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  isPopular: boolean | null;
  discountPercent: number | null;
  tags: Array<"BESTSELLER" | "NEW" | "SPECIAL">;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type CreateMenuCategoryInput = {
  restaurant: string;
  name: string;
  sortOrder?: number;
};

export type CreateMenuDishInput = {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isAvailable?: boolean;
  isPopular?: boolean;
  discountPercent?: number | null;
  tags?: Array<"BESTSELLER" | "NEW" | "SPECIAL">;
  sortOrder?: number;
};

export const getMenuCategories = async (
  restaurantId: string,
): Promise<MenuCategory[]> => {
  const response = await apiClient.get<ApiResponse<MenuCategory[]>>(
    `/categories?restaurant=${encodeURIComponent(restaurantId)}`,
  );

  return response.data.data;
};

export const createMenuCategory = async (
  payload: CreateMenuCategoryInput,
): Promise<MenuCategory> => {
  const response = await apiClient.post<ApiResponse<MenuCategory>>(
    "/categories",
    payload,
  );

  return response.data.data;
};

export const getMenuDishes = async (
  restaurantId: string,
  categoryId?: string,
): Promise<MenuDish[]> => {
  const params = new URLSearchParams({ restaurant: restaurantId });

  if (categoryId) {
    params.set("category", categoryId);
  }

  const response = await apiClient.get<ApiResponse<MenuDish[]>>(
    `/dishes?${params.toString()}`,
  );

  return response.data.data;
};

export const createMenuDish = async (
  payload: CreateMenuDishInput,
): Promise<MenuDish> => {
  const response = await apiClient.post<ApiResponse<MenuDish>>(
    "/dishes",
    payload,
  );

  return response.data.data;
};
