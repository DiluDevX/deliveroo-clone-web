import axios, { isAxiosError } from "axios";
import { CartItem } from "../store/cartSlice";
import { CartItemData, CartResponse } from "../types/cart.types";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "x-api-key": import.meta.env.VITE_BFF_API_KEY || "your-bff-api-key",
  };
};

export const getCart = async (): Promise<CartItemData[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return [];

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
    const token = localStorage.getItem("token");
    if (!token) return false;

    await axios.post(
      "/api/cart",
      {
        restaurantId,
        dishId: String(item._id),
        dishName: item.name,
        dishImageUrl: item.image,
        unitPrice: Number(item.price),
        quantity: item.quantity,
        modifiers: [],
      },
      {
        headers: {
          ...getAuthHeader(),
          "x-api-key": import.meta.env.VITE_BFF_API_KEY || "your-bff-api-key",
        },
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

export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number,
): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

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
    const token = localStorage.getItem("token");
    if (!token) return false;

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
    const token = localStorage.getItem("token");
    if (!token) return false;

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
