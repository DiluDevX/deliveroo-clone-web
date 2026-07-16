import { z } from "zod";
import { Order } from "../types/order.types";
import { apiClient } from "./api.client";

export type RestaurantOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface ReportTrendPoint {
  label: string;
  periodStart: string;
  revenue: number;
  orders: number;
}

export interface RestaurantDashboardSummary {
  timezone: "UTC";
  generatedAt: string;
  todaySales: number;
  todayOrders: number;
  salesChangePercent: number | null;
  activeOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  weeklyTrend: ReportTrendPoint[];
  topItems: Array<{
    dishId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  recentOrders: Order[];
}

export interface RestaurantAnalytics {
  timezone: "UTC";
  generatedAt: string;
  currentMonth: {
    revenue: number;
    orders: number;
    averageOrderValue: number;
    uniqueCustomers: number;
    revenueChangePercent: number | null;
    ordersChangePercent: number | null;
    averageOrderValueChangePercent: number | null;
  };
  weeklyTrend: ReportTrendPoint[];
  monthlyTrend: ReportTrendPoint[];
  categoryBreakdown: Array<{
    categoryId: string;
    quantity: number;
    percentage: number;
  }>;
  peakHours: Array<{ hour: string; orders: number }>;
}

export interface PaginatedRestaurantOrders {
  orders: Order[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type PaginatedApiResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const restaurantIdSchema = z.string().min(1, "Restaurant id is required");
const orderIdSchema = z.string().min(1, "Order id is required");
const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

export const getRestaurantOrders = async (
  restaurantId: string,
  page = 1,
  limit = 10,
): Promise<PaginatedRestaurantOrders> => {
  const parsedRestaurantId = restaurantIdSchema.parse(restaurantId);
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await apiClient.get<PaginatedApiResponse<Order>>(
    `/orders/restaurant/${encodeURIComponent(parsedRestaurantId)}?${params.toString()}`,
  );

  return {
    orders: response.data.data,
    ...response.data.pagination,
  };
};

export const updateRestaurantOrderStatus = async (
  orderId: string,
  status: RestaurantOrderStatus,
): Promise<Order> => {
  const parsedOrderId = orderIdSchema.parse(orderId);
  const parsedStatus = orderStatusSchema.parse(status);
  const response = await apiClient.patch<ApiResponse<Order>>(
    `/orders/${encodeURIComponent(parsedOrderId)}/status`,
    { status: parsedStatus },
  );

  return response.data.data;
};

export const getRestaurantDashboardSummary = async (
  restaurantId: string,
): Promise<RestaurantDashboardSummary> => {
  const parsedRestaurantId = restaurantIdSchema.parse(restaurantId);
  const response = await apiClient.get<ApiResponse<RestaurantDashboardSummary>>(
    `/orders/restaurant/${encodeURIComponent(parsedRestaurantId)}/summary`,
  );
  return response.data.data;
};

export const getRestaurantAnalytics = async (
  restaurantId: string,
): Promise<RestaurantAnalytics> => {
  const parsedRestaurantId = restaurantIdSchema.parse(restaurantId);
  const response = await apiClient.get<ApiResponse<RestaurantAnalytics>>(
    `/orders/restaurant/${encodeURIComponent(parsedRestaurantId)}/analytics`,
  );
  return response.data.data;
};
