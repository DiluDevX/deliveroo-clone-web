import { Box, Card, CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getMenuCategories,
  MenuCategory,
} from "../../services/menu-management.service";
import {
  getRestaurantAnalytics,
  RestaurantAnalytics,
} from "../../services/restaurant-admin.service";
import { useAppSelector } from "../../store/hooks/cartHooks";
import { Colors } from "../../theme";
import { showErrorSnackbar } from "../../utils/notifications";

const CHART_COLORS = [
  Colors.background.brand,
  Colors.status.success,
  Colors.status.warning,
  "#2563EB",
  "#7C3AED",
  "#DB2777",
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);

const formatChange = (change: number | null) => {
  if (change === null) return "No previous-month data";
  return `${change >= 0 ? "+" : ""}${change}% from last month`;
};

const RestaurantAnalyticsPage = () => {
  const restaurantId = useAppSelector((state) => state.auth.user?.restaurantId);
  const [analytics, setAnalytics] = useState<RestaurantAnalytics | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    if (!restaurantId) {
      setIsLoading(false);
      return;
    }

    let isActive = true;
    const loadAnalytics = async () => {
      setIsLoading(true);
      setHasLoadError(false);
      try {
        const [restaurantAnalytics, menuCategories] = await Promise.all([
          getRestaurantAnalytics(restaurantId),
          getMenuCategories(restaurantId).catch(() => []),
        ]);

        if (!isActive) return;
        setAnalytics(restaurantAnalytics);
        setCategories(menuCategories);
      } catch {
        if (isActive) {
          setHasLoadError(true);
          showErrorSnackbar("Failed to load restaurant analytics");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadAnalytics();
    return () => {
      isActive = false;
    };
  }, [restaurantId]);

  const categoryBreakdown = useMemo(() => {
    const categoryNames = new Map(
      categories.map((category) => [category.id, category.name]),
    );

    return (analytics?.categoryBreakdown ?? []).map((category, index) => ({
      ...category,
      name:
        category.categoryId === "uncategorized"
          ? "Uncategorized"
          : (categoryNames.get(category.categoryId) ?? "Unknown category"),
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [analytics?.categoryBreakdown, categories]);

  if (!restaurantId) {
    return (
      <Card sx={{ p: 4, border: `1px solid ${Colors.border.default}` }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Restaurant assignment missing
        </Typography>
        <Typography sx={{ color: Colors.text.lighter }}>
          Assign this account to a restaurant before viewing analytics.
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

  if (hasLoadError || !analytics) {
    return (
      <Card sx={{ p: 4, border: `1px solid ${Colors.border.default}` }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Analytics unavailable
        </Typography>
        <Typography sx={{ color: Colors.text.lighter }}>
          The reporting service could not load this restaurant&apos;s data. Try
          again after the service is available.
        </Typography>
      </Card>
    );
  }

  const cards = [
    {
      label: "Revenue this month",
      value: formatCurrency(analytics.currentMonth.revenue),
      detail: formatChange(analytics.currentMonth.revenueChangePercent),
      change: analytics.currentMonth.revenueChangePercent,
    },
    {
      label: "Orders this month",
      value: String(analytics.currentMonth.orders),
      detail: formatChange(analytics.currentMonth.ordersChangePercent),
      change: analytics.currentMonth.ordersChangePercent,
    },
    {
      label: "Average order value",
      value: formatCurrency(analytics.currentMonth.averageOrderValue),
      detail: formatChange(
        analytics.currentMonth.averageOrderValueChangePercent,
      ),
      change: analytics.currentMonth.averageOrderValueChangePercent,
    },
    {
      label: "Unique customers",
      value: String(analytics.currentMonth.uniqueCustomers),
      detail: "Recognized orders this month",
      change: null,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
          Analytics &amp; Insights
        </Typography>
        <Typography sx={{ color: Colors.text.lighter }}>
          Order and revenue performance. Reporting periods use UTC.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} xl={3} key={card.label}>
            <Card
              sx={{
                p: 3,
                height: "100%",
                bgcolor: Colors.background.light,
                border: `1px solid ${Colors.border.default}`,
              }}
            >
              <Typography sx={{ color: Colors.text.lighter }}>
                {card.label}
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, color: Colors.text.default, my: 1 }}
              >
                {card.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color:
                    card.change === null || card.change >= 0
                      ? Colors.status.success
                      : Colors.error.main,
                }}
              >
                {card.detail}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ p: 3, border: `1px solid ${Colors.border.default}` }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
              Weekly revenue and orders
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis yAxisId="revenue" />
                <YAxis yAxisId="orders" orientation="right" />
                <Tooltip
                  formatter={(value, name) =>
                    name === "Revenue"
                      ? formatCurrency(Number(value))
                      : Number(value)
                  }
                />
                <Legend />
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke={Colors.background.brand}
                  strokeWidth={3}
                  name="Revenue"
                />
                <Line
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  stroke={Colors.status.success}
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ p: 3, border: `1px solid ${Colors.border.default}` }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
              Items sold by category
            </Typography>
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="quantity"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                  >
                    {categoryBreakdown.map((category) => (
                      <Cell key={category.categoryId} fill={category.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ height: 300, display: "grid", placeItems: "center" }}>
                <Typography sx={{ color: Colors.text.lighter }}>
                  No recognized orders this month.
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ p: 3, border: `1px solid ${Colors.border.default}` }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
              Six-month revenue trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar
                  dataKey="revenue"
                  fill={Colors.background.brand}
                  name="Revenue"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ p: 3, border: `1px solid ${Colors.border.default}` }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
              Peak order hours
            </Typography>
            {analytics.peakHours.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.peakHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="orders"
                    fill={Colors.status.warning}
                    name="Orders"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ height: 300, display: "grid", placeItems: "center" }}>
                <Typography sx={{ color: Colors.text.lighter }}>
                  No recognized orders this month.
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantAnalyticsPage;
