import axios, { isAxiosError } from "axios";
import { CartItem } from "../store/cartSlice";

interface CartResponse {
  message?: string;
  data: {
    items: CartItem[];
  };
}

// Get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get cart from database
export const getCart = async (): Promise<CartItem[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return [];

    const userId = localStorage.getItem("id");
    if (!userId) return [];

    const response = await axios.get<CartResponse>(`/api/cart/${userId}`, {
      headers: getAuthHeader(),
    });

    return response.data.data?.items || [];
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching cart:", error.response?.data);
    }
    return [];
  }
};

// Sync entire cart to database
export const syncCart = async (items: CartItem[]): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    await axios.post("/api/cart/sync", { items }, { headers: getAuthHeader() });

    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error syncing cart:", error.response?.data);
    }
    return false;
  }
};

// Add item to cart in database
export const addItemToCart = async (item: CartItem): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    await axios.post(
      "/api/cart/add",
      {
        dishId: String(item._id),
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        image: item.image,
        description: item.description,
      },
      { headers: getAuthHeader() },
    );

    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error adding item to cart:", error.response?.data);
    }
    return false;
  }
};

// Update item quantity in database
export const updateCartItemQuantity = async (
  dishId: string,
  quantity: number,
): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    await axios.put(
      "/api/cart/update",
      { dishId, quantity },
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

// Remove item from cart in database
export const removeItemFromCart = async (dishId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    await axios.delete(`/api/cart/remove/${dishId}`, {
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

// Clear cart in database
export const clearCartInDb = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    await axios.delete("/api/cart/clear", {
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
