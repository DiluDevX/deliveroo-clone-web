import { useEffect, useState } from "react";
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
import {
  AttachMoneyTwoTone,
  DeliveryDining,
  FoodBank,
  Person,
  TrendingUp,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Colors } from "../../theme";
import { dashboardStats } from "../../data/adminMockData";
import { getAllRestaurants } from "../../services/restaurant.service";
import { Restaurant } from "../../types/restaurants";
import { FetchedAllOrders } from "../../types/orders";
import { getAllOrders } from "../../services/order.service";
import { getAllUsers } from "../../services/user.service";
import { IUser } from "../../types/user.types";
import {
  getAdminDashboardStats,
  getFinanceRecords,
} from "../../services/finance.service";
import { useNavigate } from "@tanstack/react-router";
import {
  transformFinanceToRevenueChart,
  formatChartDate,
  RevenueChartData,
} from "../../utils/chartDataTransformers";
import LoadingIndicator from "../../features/menu/components/LoadingIndicator";

const AdminDashboardPage = () => {
  const [timePeriod, setTimePeriod] = useState("7days");
  const [fetchedRestaurants, setFetchedRestaurants] = useState<Restaurant[]>();
  const [fetchedOrders, setFetchedOrders] = useState<FetchedAllOrders[]>([]);
  const [fetchedUsers, setFetchedUsers] = useState<IUser[]>([]);
  const [fetchedTotalRevenue, setFetchedTotalRevenue] = useState<number>(0);
  const [revenueChartData, setRevenueChartData] = useState<RevenueChartData[]>(
    [],
  );
  const [finishedFetchingChartData, setFinishedFetchingChartData] =
    useState(false);

  useEffect(() => {
    setFinishedFetchingChartData(false);
    async function fetchEverything() {
      const restaurants = await getAllRestaurants();
      setFetchedRestaurants(restaurants);
      const orders = await getAllOrders();
      setFetchedOrders(orders);
      const users = await getAllUsers();
      setFetchedUsers(users);
      const result = await getAdminDashboardStats();
      setFetchedTotalRevenue(result.data.stats.totalPlatformRevenue);

      // Transform Finance records into chart data (using actual commission)
      const financeRecords = await getFinanceRecords();
      const daysToShow = timePeriod === "7days" ? 7 : 30;
      const chartData = transformFinanceToRevenueChart(
        financeRecords,
        daysToShow,
      );
      setRevenueChartData(chartData);
      setFinishedFetchingChartData(true);
    }
    fetchEverything();
  }, [timePeriod]);

  const stats = [
    {
      title: "Total Restaurants",
      value: fetchedRestaurants?.length,
      icon: (
        <FoodBank sx={{ color: Colors.background.brand, fontSize: "3rem" }} />
      ),
    },
    {
      title: "Total Orders",
      value: fetchedOrders?.length,
      icon: (
        <DeliveryDining
          sx={{ color: Colors.background.brand, fontSize: "3rem" }}
        />
      ),
    },
    {
      title: "Total Revenue",
      value: `$${fetchedTotalRevenue.toFixed(2)}`,
      icon: (
        <AttachMoneyTwoTone
          sx={{ color: Colors.background.brand, fontSize: "3rem" }}
        />
      ),
    },
    {
      title: "Total Users",
      value: fetchedUsers?.length,
      icon: (
        <Person sx={{ color: Colors.background.brand, fontSize: "3rem" }} />
      ),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const navigate = useNavigate();

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
                height: "100%",
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
                {stat.value === 0 ? (
                  <LoadingIndicator variant="bar" />
                ) : (
                  stat.value
                )}
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

        {finishedFetchingChartData ? (
          <Box sx={{ mb: 2, outline: "none", "&:focus": { outline: "none" } }}>
            <ResponsiveContainer
              width="100%"
              height={300}
              style={{ outline: "none" }}
            >
              <LineChart data={revenueChartData} style={{ outline: "none" }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={Colors.border.default}
                />
                <XAxis
                  dataKey="date"
                  stroke={Colors.text.default}
                  tick={{
                    fontSize: 12,
                    fill: Colors.text.default,
                    fontFamily: "IBM Plex Sans, serif",
                  }}
                  tickFormatter={formatChartDate}
                />
                <YAxis
                  stroke={Colors.text.default}
                  tick={{
                    fontSize: 12,
                    fill: Colors.text.default,
                    fontFamily: "IBM Plex Sans, serif",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: Colors.background.light,
                    border: `1px solid ${Colors.border.default}`,
                    fontFamily: "IBM Plex Sans, serif",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: Colors.text.default }}
                  labelFormatter={(label) => formatChartDate(label as string)}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={Colors.background.brand}
                  strokeWidth={2}
                  dot={{ fill: Colors.background.brand }}
                  style={{ outline: "none" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: 300,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LoadingIndicator variant="bar" text="Fetching data..." />
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body2" sx={{ color: Colors.text.default }}>
              Total Platform Revenue
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              ${fetchedTotalRevenue.toFixed(2)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: Colors.background.brand,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <TrendingUp
                sx={{ fontSize: "1rem", color: Colors.background.brand }}
              />
              +0% Up last 7 days
            </Typography>
          </Box>
          <Button
            onClick={() => {
              navigate({ to: "/admin/finance" });
            }}
            variant="contained"
            sx={{ bgcolor: Colors.background.brand, alignSelf: "flex-end" }}
          >
            View Finance
          </Button>
        </Box>
      </Card>

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
                        size="small"
                        sx={{
                          maxWidth: "60px",
                          minWidth: "60px",
                          fontSize: "0.6rem",
                        }}
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
