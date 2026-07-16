import { People, ShoppingCart, Star, TrendingUp } from "@mui/icons-material";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getRestaurantDashboardSummary } from "../../services/restaurant-admin.service";
import { getSingleRestaurant } from "../../services/restaurant.service";
import { useAppSelector } from "../../store/hooks/cartHooks";
import { Colors } from "../../theme";
import { Order } from "../../types/order.types";
import { showErrorSnackbar } from "../../utils/notifications";
import type { RestaurantDashboardSummary } from "../../services/restaurant-admin.service";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getChangeLabel = (change: number | null) => {
  if (change === null) return "No previous-day data";
  return `${change >= 0 ? "+" : ""}${change}% from yesterday`;
};

const RestaurantDashboardPage = () => {
  const restaurantId = useAppSelector((state) => state.auth.user?.restaurantId);
  const [summary, setSummary] = useState<RestaurantDashboardSummary | null>(
    null,
  );
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) {
      setIsLoading(false);
      return;
    }

    let isActive = true;
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const [dashboardSummary, restaurant] = await Promise.all([
          getRestaurantDashboardSummary(restaurantId),
          getSingleRestaurant(restaurantId),
        ]);
        if (!isActive) return;
        setSummary(dashboardSummary);
        setRating(restaurant?.rating ?? 0);
      } catch {
        if (isActive) showErrorSnackbar("Failed to load restaurant dashboard");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadDashboard();
    return () => {
      isActive = false;
    };
  }, [restaurantId]);

  if (!restaurantId) {
    return (
      <Card sx={{ p: 4, border: `1px solid ${Colors.border.default}` }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Restaurant assignment missing
        </Typography>
        <Typography sx={{ color: Colors.text.lighter }}>
          Assign this account to a restaurant before viewing dashboard data.
        </Typography>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ minHeight: 480, display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: Colors.background.brand }} />
      </Box>
    );
  }

  if (!summary) {
    return (
      <Card sx={{ p: 4, border: `1px solid ${Colors.border.default}` }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Dashboard unavailable
        </Typography>
        <Typography sx={{ color: Colors.text.lighter }}>
          The reporting service could not load this restaurant&apos;s summary.
          Try again after the service is available.
        </Typography>
      </Card>
    );
  }

  const dashboardStats = [
    {
      label: "Today's sales",
      value: formatCurrency(summary.todaySales),
      detail: getChangeLabel(summary.salesChangePercent),
      icon: TrendingUp,
      color: Colors.status.success,
    },
    {
      label: "Active orders",
      value: String(summary.activeOrders),
      detail: `${summary.todayOrders} recognized today`,
      icon: ShoppingCart,
      color: Colors.background.brand,
    },
    {
      label: "Average rating",
      value: rating.toFixed(1),
      detail: rating > 0 ? "Restaurant rating" : "No reviews yet",
      icon: Star,
      color: Colors.status.warning,
    },
    {
      label: "Total customers",
      value: String(summary.totalCustomers),
      detail: `Average ${formatCurrency(summary.averageOrderValue)} today`,
      icon: People,
      color: "#7C3AED",
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
          Restaurant Dashboard
        </Typography>
        <Typography sx={{ color: Colors.text.lighter }}>
          Live operational overview. Revenue periods are calculated in UTC.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} xl={3} key={stat.label}>
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  bgcolor: Colors.background.light,
                  border: `1px solid ${Colors.border.default}`,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: Colors.text.lighter }}>
                    {stat.label}
                  </Typography>
                  <Icon sx={{ color: stat.color }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, my: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ color: stat.color }}>
                  {stat.detail}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={7}>
          <Card
            sx={{
              p: 3,
              border: `1px solid ${Colors.border.default}`,
              height: 380,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
              Revenue this week
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={summary.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={Colors.background.brand}
                  strokeWidth={3}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card
            sx={{
              p: 3,
              border: `1px solid ${Colors.border.default}`,
              height: 380,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
              Top selling items
            </Typography>
            {summary.topItems.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summary.topItems} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={105} />
                  <Tooltip />
                  <Bar
                    dataKey="quantity"
                    fill={Colors.background.brand}
                    name="Items sold"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ height: 280, display: "grid", placeItems: "center" }}>
                <Typography sx={{ color: Colors.text.lighter }}>
                  No recognized orders in the last 30 days.
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ p: 3, border: `1px solid ${Colors.border.default}` }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
          Recent orders
        </Typography>
        {summary.recentOrders.length === 0 ? (
          <Typography sx={{ color: Colors.text.lighter }}>
            No orders have been placed yet.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {summary.recentOrders.map((order: Order, index) => (
              <Box
                key={order.id}
                sx={{
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  borderBottom:
                    index === summary.recentOrders.length - 1
                      ? "none"
                      : `1px solid ${Colors.border.default}`,
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>
                    {order.orderNumber}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: Colors.text.lighter }}
                  >
                    {order.items.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}{" "}
                    items
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography sx={{ fontWeight: 800 }}>
                    {formatCurrency(order.totalAmount)}
                  </Typography>
                  <Chip label={formatStatus(order.status)} size="small" />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default RestaurantDashboardPage;
