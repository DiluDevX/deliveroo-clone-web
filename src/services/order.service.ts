import axios from "axios";
import { Orders } from "../types/orders";

export const getAllOrders = async (): Promise<Orders[]> => {
  try {
    const response = await axios.get("/api/admin/orders");
    if (!response.data) {
      throw new Error("Failed to fetch all Orders.");
    }
    const data = await response.data;
    return data.data;
  } catch {
    return [];
  }
};

export const getTotalRevenue = async (): Promise<number> => {
  try {
    const response = await axios.get("/api/admin/orders/revenue/total");
    if (!response.data) {
      throw new Error("Failed to fetch total revenue.");
    }
    const data = await response.data;
    return data.totalRevenue || 0;
  } catch {
    return 0;
  }
};

export const getRevenueForMonth = async (): Promise<number> => {
  try {
    const response = await axios.get("/api/admin/orders/revenue/month");
    if (!response.data) {
      throw new Error("Failed to fetch total revenue for last month.");
    }
    const data = await response.data;
    return data.totalRevenue || 0;
  } catch {
    return 0;
  }
};

export const getRevenueForWeek = async (): Promise<number> => {
  try {
    const response = await axios.get("/api/admin/orders/revenue/week");
    if (!response.data) {
      throw new Error("Failed to fetch total revenue for last week.");
    }
    const data = await response.data;
    return data.totalRevenue || 0;
  } catch {
    return 0;
  }
};
