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

const DUMMY_ORDERS: Order[] = [
  {
    id: "ord_001",
    orderNumber: "ORD-20250415-A1B2C",
    userId: "user_001",
    restaurantId: "resto_001",
    driverId: "driver_001",
    status: "DELIVERED",
    subtotal: 24.99,
    deliveryFee: 2.99,
    serviceFee: 0.99,
    discountAmount: 0,
    totalAmount: 28.97,
    deliveryAddress: {
      line1: "123 Main St",
      city: "London",
      postcode: "SW1A 1AA",
      country: "UK",
    },
    restaurantName: "Burger King",
    restaurantAddress: "123 High St, London",
    estimatedDeliveryAt: "2024-01-15T12:00:00Z",
    actualDeliveryAt: "2024-01-15T12:30:00Z",
    promoCode: null,
    cancelledAt: null,
    cancellationActor: null,
    cancellationReason: null,
    items: [
      {
        id: "item_001",
        dishId: "dish_001",
        dishName: "Cheese Burger",
        dishImageUrl:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
        dishCategory: "Burgers",
        unitPrice: 9.99,
        quantity: 2,
        lineTotal: 19.98,
        modifiers: [],
      },
      {
        id: "item_002",
        dishId: "dish_002",
        dishName: "Fries",
        dishImageUrl:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
        dishCategory: "Sides",
        unitPrice: 3.99,
        quantity: 1,
        lineTotal: 3.99,
        modifiers: [],
      },
    ],
    statusHistory: [
      {
        id: "hist_001",
        status: "PENDING",
        note: null,
        actorId: null,
        actorType: null,
        createdAt: "2024-01-15T11:00:00Z",
      },
      {
        id: "hist_002",
        status: "CONFIRMED",
        note: null,
        actorId: null,
        actorType: null,
        createdAt: "2024-01-15T11:05:00Z",
      },
      {
        id: "hist_003",
        status: "PREPARING",
        note: null,
        actorId: null,
        actorType: null,
        createdAt: "2024-01-15T11:10:00Z",
      },
      {
        id: "hist_004",
        status: "ON_THE_WAY",
        note: null,
        actorId: "driver_001",
        actorType: "DRIVER",
        createdAt: "2024-01-15T12:00:00Z",
      },
      {
        id: "hist_005",
        status: "DELIVERED",
        note: null,
        actorId: "driver_001",
        actorType: "DRIVER",
        createdAt: "2024-01-15T12:30:00Z",
      },
    ],
    createdAt: "2024-01-15T11:00:00Z",
    updatedAt: "2024-01-15T12:30:00Z",
  },
  {
    id: "ord_002",
    orderNumber: "ORD-20250410-B2C3D",
    userId: "user_001",
    restaurantId: "resto_002",
    driverId: "driver_002",
    status: "PENDING",
    subtotal: 18.97,
    deliveryFee: 2.99,
    serviceFee: 0.99,
    discountAmount: 0,
    totalAmount: 22.95,
    deliveryAddress: {
      line1: "123 Main St",
      city: "London",
      postcode: "SW1A 1AA",
      country: "UK",
    },
    restaurantName: "Pizza Hut",
    restaurantAddress: "456 Oxford St, London",
    estimatedDeliveryAt: null,
    actualDeliveryAt: null,
    promoCode: null,
    cancelledAt: null,
    cancellationActor: null,
    cancellationReason: null,
    items: [
      {
        id: "item_003",
        dishId: "dish_003",
        dishName: "Pepperoni Pizza",
        dishImageUrl:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
        dishCategory: "Pizzas",
        unitPrice: 12.99,
        quantity: 1,
        lineTotal: 12.99,
        modifiers: [],
      },
      {
        id: "item_004",
        dishId: "dish_004",
        dishName: "Garlic Bread",
        dishImageUrl:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
        dishCategory: "Starters",
        unitPrice: 4.99,
        quantity: 1,
        lineTotal: 4.99,
        modifiers: [],
      },
    ],
    statusHistory: [
      {
        id: "hist_006",
        status: "PENDING",
        note: null,
        actorId: null,
        actorType: null,
        createdAt: "2024-01-10T18:00:00Z",
      },
    ],
    createdAt: "2024-01-10T18:00:00Z",
    updatedAt: "2024-01-10T18:00:00Z",
  },
];

export const getOrderHistory = async (): Promise<Order[]> => {
  if (import.meta.env.VITE_BYPASS_AUTH === "true") {
    return DUMMY_ORDERS;
  }

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

export const getAllOrders = async (): Promise<FetchedAllOrders[]> => {
  const orders = await getOrderHistory();

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
        totalAmount: response.data.data.totalAmount,
        estimatedDeliveryAt: response.data.data.estimatedDeliveryAt,
      };
    }
    return null;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error during checkout:", error.response?.data);
    }
    return null;
  }
};
