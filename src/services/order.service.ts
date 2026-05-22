import { isAxiosError } from "axios";
import {
  Order,
  CheckoutRequest,
  CheckoutResult,
  CheckoutResponse,
} from "../types/order.types";
import { FetchedAllOrders } from "../types/orders";
import { getAuthHeader } from "./auth-headers";
import { apiClient } from "./api.client";

export const getOrderHistory = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: Order[] }>(
      "/orders",
      { headers: getAuthHeader() },
    );
    return response.data.data || [];
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching order history:", error.response?.data);
    }
    return [];
  }
};

const getAdminOrdersSource = async (): Promise<Order[]> => {
  const response = await apiClient.get<{ success: boolean; data: Order[] }>(
    "/orders?limit=100",
    { headers: getAuthHeader() },
  );

  return response.data.data || [];
};

export const getAllOrders = async (): Promise<FetchedAllOrders[]> => {
  const orders = await getAdminOrdersSource();

  return orders.map((order) => ({
    _id: order.id,
    id: order.id,
    restaurantId: {
      _id: order.restaurantId,
      name: order.restaurantName,
    },
    userId: order.userId,
    items: order.items.map((item) => ({
      _id: item.id,
      dish: item.dishName,
      quantity: item.quantity,
    })),
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: Order }>(
      `/orders/${orderId}`,
      { headers: getAuthHeader() },
    );
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching order:", error.response?.data);
    }
    return null;
  }
};

export const checkoutCart = async (
  checkoutData: CheckoutRequest,
): Promise<CheckoutResult | null> => {
  try {
    const response = await apiClient.post<CheckoutResponse>(
      "/cart/checkout",
      checkoutData,
      {
        headers: getAuthHeader(),
      },
    );

    if (response.data.success && response.data.data) {
      return {
        orderId: response.data.data.id,
        orderNumber: response.data.data.orderNumber,
        status: response.data.data.status,
        paymentStatus: response.data.data.paymentStatus,
        paymentId: response.data.data.paymentId,
        paymentMethod: response.data.data.paymentMethod,
        paymentExpiresAt: response.data.data.paymentExpiresAt,
        subtotal: response.data.data.subtotal,
        deliveryFee: response.data.data.deliveryFee,
        serviceFee: response.data.data.serviceFee,
        discountAmount: response.data.data.discountAmount,
        totalAmount: response.data.data.totalAmount,
        estimatedDeliveryAt: response.data.data.estimatedDeliveryAt,
      };
    }
    return null;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error during checkout:", error.response?.data);
      console.error("Checkout error status:", error.response?.status);
      console.error("Checkout error message:", error.message);
    } else {
      console.error("Non-axios checkout error:", error);
    }
    return null;
  }
};
