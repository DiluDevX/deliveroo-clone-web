import { isAxiosError } from "axios";
import { CartItem } from "../store/cartSlice";
import { apiClient } from "./api.client";

interface CartResponse {
  message?: string;
  data: {
    items: CartItem[];
  };
}

// Get cart from database
export const getCart = async (): Promise<CartItem[]> => {
  try {
    const userId = localStorage.getItem("id");
    if (!userId) return [];

    const response = await apiClient.get<CartResponse>(`/cart/${userId}`);

    return response.data.data?.items || [];
  } catch {
    return [];
  }
};

// Sync entire cart to database
export const syncCart = async (items: CartItem[]): Promise<boolean> => {
  try {
    await apiClient.post("/cart/sync", { items });
    return true;
  } catch {
    return false;
  }
};

// Add item to cart in database
export const addItemToCart = async (item: CartItem): Promise<boolean> => {
  try {
    await apiClient.post("/cart/add", {
      dishId: String(item._id),
      name: item.name,
      price: Number(item.price),
      quantity: item.quantity,
      image: item.image,
      description: item.description,
    });

    return true;
  } catch {
    return false;
  }
};

// Update item quantity in database
export const updateCartItemQuantity = async (
  dishId: string,
  quantity: number,
): Promise<boolean> => {
  try {
    await apiClient.put("/cart/update", { dishId, quantity });
    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error("Error updating cart");
    }
    return false;
  }
};

// Remove item from cart in database
export const removeItemFromCart = async (dishId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    await apiClient.delete(`/cart/remove/${dishId}`, {});

    return true;
  } catch {
    return false;
  }
};

// Clear cart in database
export const clearCartInDb = async (): Promise<boolean> => {
  try {
    await apiClient.delete("/cart/clear");
    return true;
  } catch {
    return false;
  }
};
