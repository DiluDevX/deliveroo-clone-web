import axios, { isAxiosError } from "axios";
import { CartItem } from "../store/cartSlice";
import { CartItemData, CartResponse } from "../types/cart.types";
import { getAuthHeader } from "./auth-headers";

export const getCart = async (): Promise<CartItemData[]> => {
  try {
    const response = await axios.get<CartResponse>("/api/cart/", {
      headers: getAuthHeader(),
    });

    const items = response.data.data?.items || [];
    return items;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching cart:", error.response?.data);
    }
    return [];
  }
};

export const addItemToCart = async (
  item: CartItem,
  restaurantId: string,
): Promise<boolean> => {
  try {
    await axios.post(
      "/api/cart",
      {
        restaurantId,
        dishId: String(item._id),
        dishName: item.name,
        dishImageUrl: item.image,
        unitPrice: Number(item.price),
        quantity: item.quantity,
        modifiers: item.modifiers ?? [],
      },
      {
        headers: getAuthHeader(),
      },
    );

    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error adding item to cart:", error.response?.data);
    }
    return false;
  }
};

export const syncCart = async (
  items: CartItem[],
  restaurantId: string,
): Promise<CartItemData[] | null> => {
  try {
    const response = await axios.post<CartResponse>(
      "/api/cart/sync",
      {
        restaurantId,
        items: items.map((item) => ({
          dishId: String(item._id),
          quantity: item.quantity,
          modifiers: (item.modifiers ?? []).map((modifier) => ({
            name: modifier.name,
            option: modifier.option,
            extraPrice: modifier.extraPrice,
          })),
        })),
      },
      { headers: getAuthHeader() },
    );

    return response.data.data?.items || [];
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error syncing cart:", error.response?.data);
    }
    return null;
  }
};

export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number,
): Promise<boolean> => {
  try {
    await axios.put(
      `/api/cart/items/${cartItemId}`,
      { quantity },
      { headers: getAuthHeader() },
    );

    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error updating cart item:", error.response?.data);
    }
    return false;
  }
};

export const removeItemFromCart = async (
  cartItemId: string,
): Promise<boolean> => {
  try {
    await axios.delete(`/api/cart/items/${cartItemId}`, {
      headers: getAuthHeader(),
    });

    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error removing item from cart:", error.response?.data);
    }
    return false;
  }
};

export const clearCartInDb = async (): Promise<boolean> => {
  try {
    await axios.delete("/api/cart/", {
      headers: getAuthHeader(),
    });

    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error clearing cart:", error.response?.data);
    }
    return false;
  }
};
