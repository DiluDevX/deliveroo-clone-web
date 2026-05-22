import { Box, Card, Grid, Typography, Chip } from "@mui/material";
import { TrendingUp, ShoppingCart, Star, People } from "@mui/icons-material";
import { Colors } from "../../theme";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const RestaurantDashboardPage = () => {
  const dashboardStats = [
    {
      label: "Today's Sales",
      value: "$0.00",
      change: "No data",
      icon: TrendingUp,
      color: "#10B981",
    },
    {
      label: "Active Orders",
      value: "0",
      change: "No data",
      icon: ShoppingCart,
      color: "#3B82F6",
    },
    {
      label: "Average Rating",
      value: "0.0",
      change: "No reviews",
      icon: Star,
      color: "#F59E0B",
    },
    {
      label: "Total Customers",
      value: "0",
      change: "No data",
      icon: People,
      color: "#8B5CF6",
    },
  ];

  const revenueChartData: Array<{ day: string; revenue: number }> = [];

  const popularItemsData: Array<{ name: string; orders: number }> = [];

  const recentOrders: Array<{
    id: string;
    customer: string;
    items: number;
    total: string;
    status: string;
    time: string;
  }> = [];

  const StatCard = ({ stat }: { stat: (typeof dashboardStats)[0] }) => {
    const IconComponent = stat.icon;
    return (
      <Card
        sx={{
          p: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="body2" sx={{ color: Colors.text.default }}>
            {stat.label}
          </Typography>
          <IconComponent sx={{ color: stat.color, fontSize: 24 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          {stat.value}
        </Typography>
        <Typography variant="caption" sx={{ color: stat.color }}>
          {stat.change}
        </Typography>
      </Card>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Restaurant Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: Colors.text.default }}>
          Welcome back! Here's your restaurant performance overview
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardStats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <StatCard stat={stat} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Trend */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              bgcolor: Colors.background.light,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Weekly Revenue Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={Colors.background.brand}
                  strokeWidth={2}
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Popular Items */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              bgcolor: Colors.background.light,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Top Selling Items
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularItemsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="orders"
                  fill={Colors.background.brand}
                  name="Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Orders and Orders/Day Trend */}
      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              bgcolor: Colors.background.light,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Recent Orders
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentOrders.map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    p: 2,
                    bgcolor: Colors.background.default,
                    borderRadius: "0.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", mb: 0.5 }}
                    >
                      {order.id}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: Colors.text.placeholder }}
                    >
                      {order.customer} • {order.items} items
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", mb: 0.5 }}
                    >
                      {order.total}
                    </Typography>
                    <Chip
                      label={order.status}
                      size="small"
                      color={
                        order.status === "Delivered"
                          ? "success"
                          : order.status === "Preparing"
                            ? "warning"
                            : "info"
                      }
                      sx={{ maxWidth: "70px" }}
                    />
                  </Box>
                </Box>
              ))}
              {recentOrders.length === 0 && (
                <Typography sx={{ color: Colors.text.placeholder }}>
                  No recent orders found.
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Orders per Day */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              bgcolor: Colors.background.light,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Orders per Day
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="orders"
                  fill={Colors.background.brand}
                  name="Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantDashboardPage;
