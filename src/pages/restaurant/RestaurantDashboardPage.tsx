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
  // Mock data for restaurant dashboard
  const dashboardStats = [
    {
      label: "Today's Sales",
      value: "$2,450.50",
      change: "+12.5%",
      icon: TrendingUp,
      color: "#10B981",
    },
    {
      label: "Active Orders",
      value: "8",
      change: "In progress",
      icon: ShoppingCart,
      color: "#3B82F6",
    },
    {
      label: "Average Rating",
      value: "4.8",
      change: "342 reviews",
      icon: Star,
      color: "#F59E0B",
    },
    {
      label: "Total Customers",
      value: "1,240",
      change: "+45 this month",
      icon: People,
      color: "#8B5CF6",
    },
  ];

  const revenueChartData = [
    { day: "Mon", revenue: 1200, orders: 15 },
    { day: "Tue", revenue: 1800, orders: 22 },
    { day: "Wed", revenue: 1500, orders: 18 },
    { day: "Thu", revenue: 2100, orders: 28 },
    { day: "Fri", revenue: 2800, orders: 35 },
    { day: "Sat", revenue: 3200, orders: 42 },
    { day: "Sun", revenue: 2600, orders: 33 },
  ];

  const popularItemsData = [
    { name: "Margherita Pizza", orders: 145 },
    { name: "Caesar Salad", orders: 98 },
    { name: "Pasta Carbonara", orders: 112 },
    { name: "Garlic Bread", orders: 87 },
    { name: "Tiramisu", orders: 64 },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      items: 3,
      total: "$45.99",
      status: "Delivered",
      time: "2 hours ago",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      items: 2,
      total: "$32.50",
      status: "Preparing",
      time: "15 mins ago",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      items: 4,
      total: "$67.25",
      status: "Ready",
      time: "Just now",
    },
  ];

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
