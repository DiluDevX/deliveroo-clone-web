import { Box, Card, Grid, Typography } from "@mui/material";
import { Colors } from "../../theme";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const RestaurantAnalyticsPage = () => {
  // Mock analytics data
  const revenueData = [
    { week: "Week 1", revenue: 2400, orders: 45 },
    { week: "Week 2", revenue: 3200, orders: 58 },
    { week: "Week 3", revenue: 2800, orders: 52 },
    { week: "Week 4", revenue: 3800, orders: 71 },
    { week: "Week 5", revenue: 4200, orders: 85 },
  ];

  const categoryBreakdown = [
    { name: "Pizza", value: 35, color: "#FF6B6B" },
    { name: "Salads", value: 20, color: "#4ECDC4" },
    { name: "Pasta", value: 25, color: "#FFE66D" },
    { name: "Desserts", value: 15, color: "#A8E6CF" },
    { name: "Drinks", value: 5, color: "#FF8B94" },
  ];

  const monthlyStats = [
    { month: "Jan", revenue: 8500, orders: 210 },
    { month: "Feb", revenue: 12300, orders: 298 },
    { month: "Mar", revenue: 15600, orders: 365 },
    { month: "Apr", revenue: 14200, orders: 340 },
    { month: "May", revenue: 18900, orders: 450 },
    { month: "Jun", revenue: 21500, orders: 520 },
  ];

  const peakHours = [
    { hour: "11:00", orders: 15 },
    { hour: "12:00", orders: 42 },
    { hour: "13:00", orders: 38 },
    { hour: "14:00", orders: 18 },
    { hour: "18:00", orders: 22 },
    { hour: "19:00", orders: 56 },
    { hour: "20:00", orders: 48 },
    { hour: "21:00", orders: 25 },
  ];

  const analyticsCards = [
    {
      label: "Total Revenue (Month)",
      value: "$21,500",
      change: "+15.2%",
    },
    {
      label: "Total Orders (Month)",
      value: "520",
      change: "+8.5%",
    },
    {
      label: "Average Order Value",
      value: "$41.35",
      change: "+3.2%",
    },
    {
      label: "Customer Satisfaction",
      value: "4.7/5",
      change: "+0.2",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Analytics & Insights
        </Typography>
        <Typography variant="body2" sx={{ color: Colors.text.default }}>
          Detailed analytics about your restaurant's performance
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {analyticsCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                p: 3,
                bgcolor: Colors.background.light,
                border: `1px solid ${Colors.border.default}`,
              }}
            >
              <Typography variant="body2" sx={{ color: Colors.text.default }}>
                {card.label}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  my: 1,
                  color: Colors.background.brand,
                }}
              >
                {card.value}
              </Typography>
              <Typography variant="caption" sx={{ color: "#10B981" }}>
                {card.change}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Weekly Revenue */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              bgcolor: Colors.background.light,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Weekly Revenue & Orders
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke={Colors.background.brand}
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              bgcolor: Colors.background.light,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Orders by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* More Charts */}
      <Grid container spacing={3}>
        {/* Monthly Trend */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              bgcolor: Colors.background.light,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              6-Month Revenue Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill={Colors.background.brand}
                  name="Revenue ($)"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Peak Hours */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              bgcolor: Colors.background.light,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Peak Order Hours
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="orders"
                  fill="#F59E0B"
                  name="Orders"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantAnalyticsPage;
