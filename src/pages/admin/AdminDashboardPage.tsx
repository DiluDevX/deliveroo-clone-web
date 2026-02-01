import { useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  ButtonGroup,
} from "@mui/material";
import { GifBox, Money, Restaurant, TrendingUp } from "@mui/icons-material";
import { Colors } from "../../theme";
import { dashboardStats } from "../../data/adminMockData";

const AdminDashboardPage = () => {
  const [timePeriod, setTimePeriod] = useState("7days");

  const stats = [
    {
      title: "Total Restaurants",
      value: dashboardStats.totalRestaurants,
      icon: (
        <Restaurant sx={{ color: Colors.background.brand, fontSize: "3rem" }} />
      ),
    },
    {
      title: "Total Orders",
      value: dashboardStats.totalOrders,
      icon: (
        <GifBox sx={{ color: Colors.background.brand, fontSize: "3rem" }} />
      ),
    },
    {
      title: "Total Revenue",
      value: `$${dashboardStats.totalRevenue.toFixed(2)}`,
      icon: <Money sx={{ color: Colors.background.brand, fontSize: "3rem" }} />,
    },
    {
      title: "Total Users",
      value: dashboardStats.totalUsers,
      icon: (
        <TrendingUp sx={{ color: Colors.background.brand, fontSize: "3rem" }} />
      ),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Platform Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: Colors.text.default }}>
          Overview of platform performance, restaurants, and orders.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card
              sx={{
                p: 2.5,
                bgcolor: Colors.background.light,
                border: `1px solid ${Colors.border.default}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography sx={{ fontSize: "2rem" }}>{stat.icon}</Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: Colors.text.default, mb: 1 }}
              >
                {stat.title}
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: Colors.text.default }}
              >
                {stat.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Platform Revenue Overview Section */}
      <Card
        sx={{
          p: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 0.5, color: Colors.text.default }}
            >
              Platform Revenue
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <ButtonGroup size="small" variant="outlined">
              <Button
                onClick={() => setTimePeriod("7days")}
                variant={timePeriod === "7days" ? "contained" : "outlined"}
                sx={{
                  bgcolor:
                    timePeriod === "7days"
                      ? Colors.background.brand
                      : "transparent",
                  color:
                    timePeriod === "7days"
                      ? Colors.text.inverse
                      : Colors.text.default,
                }}
              >
                Last 7 days
              </Button>
              <Button
                onClick={() => setTimePeriod("30days")}
                variant={timePeriod === "30days" ? "contained" : "outlined"}
                sx={{
                  bgcolor:
                    timePeriod === "30days"
                      ? Colors.background.brand
                      : "transparent",
                  color:
                    timePeriod === "30days"
                      ? Colors.text.inverse
                      : Colors.text.default,
                }}
              >
                Last 30 days
              </Button>
            </ButtonGroup>
          </Box>
        </Box>

        {/* Filter Tabs */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
          {["Total Revenue", "Commission Earned", "Payouts Made"].map(
            (filter) => (
              <Button
                key={filter}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: Colors.background.brand,
                  color: Colors.background.brand,
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                {filter}
              </Button>
            ),
          )}
        </Box>

        {/* Chart Placeholder */}
        <Box
          sx={{
            height: 300,
            bgcolor: "rgba(0, 0, 0, 0.02)",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              color: Colors.text.default,
              textAlign: "center",
            }}
          >
            📊 Revenue Chart (recharts, chart.js, etc)
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body2" sx={{ color: Colors.text.default }}>
              Total Platform Revenue
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              ${dashboardStats.totalRevenue.toFixed(2)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "success.main",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <TrendingUp sx={{ fontSize: "1rem" }} />
              +31% Up last 7 days
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{ bgcolor: Colors.background.brand, alignSelf: "flex-end" }}
          >
            View Finance
          </Button>
        </Box>
      </Card>

      {/* Recent Orders Section */}
      <Card
        sx={{
          mt: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Recent Orders
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(0, 0, 0, 0.05)" }}>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Restaurant</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardStats.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {order.id}
                    </TableCell>
                    <TableCell>{order.restaurant}</TableCell>
                    <TableCell>{order.user}</TableCell>
                    <TableCell>${order.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: Colors.text.default }}>
                      {order.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    </Box>
  );
};

export default AdminDashboardPage;
