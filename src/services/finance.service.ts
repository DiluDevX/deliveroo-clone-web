import axios from "axios";

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
