import { apiClient } from "./api.client";
import { z } from "zod";

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

export type UpdateMenuDishInput = Partial<
  Omit<CreateMenuDishInput, "image" | "description">
> & {
  description?: string;
  image?: string | null;
};

const dishIdSchema = z.string().min(1, "Dish id is required");
const updateMenuDishSchema = z
  .object({
    categoryId: z.string().min(1).optional(),
    name: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(1000).optional(),
    price: z.number().min(0).optional(),
    image: z.string().url().nullable().optional(),
    isVegetarian: z.boolean().optional(),
    isSpicy: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
    isPopular: z.boolean().optional(),
    discountPercent: z.number().min(0).max(100).nullable().optional(),
    tags: z.array(z.enum(["BESTSELLER", "NEW", "SPECIAL"])).optional(),
    sortOrder: z.number().int().min(0).optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one dish field must be updated",
  });

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

export const updateMenuDish = async (
  dishId: string,
  payload: UpdateMenuDishInput,
): Promise<MenuDish> => {
  const parsedDishId = dishIdSchema.parse(dishId);
  const parsedPayload = updateMenuDishSchema.parse(payload);
  const response = await apiClient.patch<ApiResponse<MenuDish>>(
    `/dishes/${encodeURIComponent(parsedDishId)}`,
    parsedPayload,
  );

  return response.data.data;
};

export const deleteMenuDish = async (dishId: string): Promise<void> => {
  const parsedDishId = dishIdSchema.parse(dishId);
  await apiClient.delete(`/dishes/${encodeURIComponent(parsedDishId)}`);
};
