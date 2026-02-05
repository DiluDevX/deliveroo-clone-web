import { FetchedAllOrders } from "../types/orders";

export interface RevenueChartData {
  date: string;
  revenue: number;
  commission: number;
}

export const transformOrdersToRevenueChart = (
  orders: FetchedAllOrders[],
  days: number = 7,
  commissionPercentage: number = 10,
): RevenueChartData[] => {
  // Calculate date range
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days);

  // Group orders by date
  const groupedByDate: { [key: string]: number } = {};

  orders.forEach((order) => {
    // Parse the createdAt date
    const orderDate = new Date(order.createdAt);

    // Only include orders within date range
    if (orderDate >= startDate && orderDate <= today) {
      // Format date as YYYY-MM-DD
      const dateKey = orderDate.toISOString().split("T")[0];

      // Sum the revenue for this date
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = 0;
      }
      groupedByDate[dateKey] += order.totalAmount;
    }
  });

  // Convert to chart format with calculated commission
  const chartData = Object.entries(groupedByDate).map(([date, revenue]) => ({
    date,
    revenue: Number.parseFloat(revenue.toFixed(2)),
    commission: Number.parseFloat(
      (revenue * (commissionPercentage / 100)).toFixed(2),
    ),
  }));

  //  Sort by date (earliest first)
  chartData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  //  Fill in missing dates with zero revenue
  //  ensure chart shows all days even if there are no orders
  const filledData: RevenueChartData[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const existing = chartData.find((d) => d.date === dateStr);
    filledData.push(existing || { date: dateStr, revenue: 0, commission: 0 });
  }

  return filledData;
};

/**
 * Transform Finance records (pre-calculated) into chart data
 * This is the CORRECT approach - uses actual commission from database
 * Instead of recalculating from orders
 */
export const transformFinanceToRevenueChart = (
  financeRecords: Array<{
    totalRevenue: number;
    platformCommission: number;
    commissionPercentage?: number;
    createdAt: string;
  }>,
  days: number = 7,
): RevenueChartData[] => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days);

  const groupedByDate: {
    [key: string]: { revenue: number; commission: number };
  } = {};

  financeRecords.forEach((record) => {
    const recordDate = new Date(record.createdAt);

    if (recordDate >= startDate && recordDate <= today) {
      const dateKey = recordDate.toISOString().split("T")[0];

      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = { revenue: 0, commission: 0 };
      }
      groupedByDate[dateKey].revenue += record.totalRevenue;

      // Calculate actual commission: revenue * (percentage / 100)
      // platformCommission might be the percentage, so calculate the actual amount
      const commissionAmount =
        record.totalRevenue *
        ((record.commissionPercentage || record.platformCommission || 10) /
          100);
      groupedByDate[dateKey].commission += commissionAmount;
    }
  });

  const chartData = Object.entries(groupedByDate).map(
    ([date, { revenue, commission }]) => ({
      date,
      revenue: Number.parseFloat(revenue.toFixed(2)),
      commission: Number.parseFloat(commission.toFixed(2)),
    }),
  );

  chartData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const filledData: RevenueChartData[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const existing = chartData.find((d) => d.date === dateStr);
    filledData.push(existing || { date: dateStr, revenue: 0, commission: 0 });
  }

  return filledData;
};

// Format date for display

export const formatChartDate = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
