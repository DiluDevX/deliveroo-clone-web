import axios from "axios";
import { FinanceRecord } from "../types/finance.types";

export const getAdminDashboardStats = async (): Promise<{
  data: { stats: { totalPlatformRevenue: number } };
}> => {
  try {
    const response = await axios.get("/api/finance/admin-dashboard-stats");
    if (!response.data) {
      throw new Error("Failed to fetch admin dashboard stats.");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return { data: { stats: { totalPlatformRevenue: 0 } } };
  }
};

export const getFinanceRecords = async (): Promise<FinanceRecord[]> => {
  try {
    const response = await axios.get("/api/finance/all");
    if (!response.data) {
      throw new Error("Failed to fetch finance records.");
    }
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching finance records:", error);
    return [];
  }
};
