import { FinanceRecord } from "../types/finance.types";
import { apiClient } from "./api.client";
import { getAuthHeader } from "./auth-headers";

type AdminFinanceStats = {
  totalPlatformRevenue: number;
  totalCommission: number;
  restaurantPayoutMade: number;
  pendingPayoutAmount: number;
};

type PendingRestaurantPayout = {
  restaurantId: string;
  restaurantName: string;
  amountDue: number;
  status: string;
};

export const getAdminDashboardStats = async (): Promise<{
  data: {
    stats: AdminFinanceStats;
    pendingPayouts?: PendingRestaurantPayout[];
  };
}> => {
  try {
    const response = await apiClient.get("/finance/admin-dashboard-stats", {
      headers: getAuthHeader(),
    });
    if (!response.data) {
      throw new Error("Failed to fetch admin dashboard stats.");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return {
      data: {
        stats: {
          totalPlatformRevenue: 0,
          totalCommission: 0,
          restaurantPayoutMade: 0,
          pendingPayoutAmount: 0,
        },
        pendingPayouts: [],
      },
    };
  }
};

export const getFinanceRecords = async (): Promise<FinanceRecord[]> => {
  try {
    const response = await apiClient.get("/finance/all", {
      headers: getAuthHeader(),
    });
    if (!response.data) {
      throw new Error("Failed to fetch finance records.");
    }
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching finance records:", error);
    return [];
  }
};
