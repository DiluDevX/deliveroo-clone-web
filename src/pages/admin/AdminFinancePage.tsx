import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  ButtonGroup,
  TextField,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Colors } from "../../theme";
import Button from "../../features/menu/components/Button";
import LoadingIndicator from "../../features/menu/components/LoadingIndicator";
import {
  transformFinanceToRevenueChart,
  formatChartDate,
  RevenueChartData,
} from "../../utils/chartDataTransformers";
import {
  getAdminDashboardStats,
  getFinanceRecords,
} from "../../services/finance.service";

const AdminFinancePage = () => {
  const [timePeriod, setTimePeriod] = useState("7days");
  const [payoutSearch, setPayoutSearch] = useState("");
  const [financeStats, setFinanceStats] = useState<FinanceStats["stats"]>({
    totalPlatformRevenue: 0,
    totalCommission: 0,
    restaurantPayoutMade: 0,
    pendingPayoutAmount: 0,
  });
  const [pendingPayouts, setPendingPayouts] = useState<
    FinanceStats["pendingPayouts"]
  >([]);
  const [revenueChartData, setRevenueChartData] = useState<RevenueChartData[]>(
    [],
  );
  const [finishedFetchingChartData, setFinishedFetchingChartData] =
    useState(false);

  interface FinanceStats {
    stats: {
      totalPlatformRevenue: number;
      totalCommission: number;
      restaurantPayoutMade: number;
      pendingPayoutAmount: number;
    };
    pendingPayouts?: {
      restaurantId: string;
      restaurantName: string;
      amountDue: number;
      status: string;
    }[];
  }

  // Fetch finance stats on mount
  useEffect(() => {
    setFinishedFetchingChartData(false);
    const fetchFinanceStats = async () => {
      try {
        const response = await getAdminDashboardStats();
        const data = response.data;
        setFinanceStats(data.stats);
        setPendingPayouts(data.pendingPayouts || []);

        // Fetch finance records and transform to chart data
        const financeRecords = await getFinanceRecords();
        const daysToShow = timePeriod === "7days" ? 7 : 30;
        const chartData = transformFinanceToRevenueChart(
          financeRecords,
          daysToShow,
        );
        setRevenueChartData(chartData);
        setFinishedFetchingChartData(true);
      } catch (error) {
        console.error("Error fetching finance data:", error);
        setFinishedFetchingChartData(true);
      }
    };
    fetchFinanceStats();
  }, [timePeriod]);

  const stats = [
    {
      title: "Total Revenue",
      value: `$${financeStats.totalPlatformRevenue.toFixed(2)}`,
      change: "0%",
    },
    {
      title: "Total Commission",
      value: `$${financeStats.totalCommission.toFixed(2)}`,
      change: "0%",
    },
    {
      title: "Restaurant Payouts",
      value:
        financeStats.restaurantPayoutMade === undefined
          ? "0.00"
          : `$${financeStats.restaurantPayoutMade.toFixed(2)}`,
      change: "0%",
    },
    {
      title: "Pending Payouts",
      value: `$${financeStats.pendingPayoutAmount.toFixed(2)}`,
      change: "0%",
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Financial Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: Colors.text.default }}>
          Revenue, commissions, and payouts overview
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
              <Typography
                variant="body2"
                sx={{ color: Colors.text.default, mb: 1 }}
              >
                {stat.title}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: Colors.background.brand }}
              >
                {stat.change}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={12}>
          <Card
            sx={{
              p: 3,
              bgcolor: Colors.background.light,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Revenue Trend
              </Typography>
              <ButtonGroup>
                <Button
                  sx={{
                    padding: "5px",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  onClick={() => {
                    setTimePeriod("7days");
                  }}
                  variant={timePeriod === "7days" ? "filled" : "border"}
                >
                  7D
                </Button>
                <Button
                  sx={{
                    padding: "5px",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                  onClick={() => {
                    setTimePeriod("30days");
                  }}
                  variant={timePeriod === "30days" ? "filled" : "border"}
                >
                  30D
                </Button>
              </ButtonGroup>
            </Box>
            {finishedFetchingChartData ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid stroke={Colors.border.default} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    tick={{
                      fontSize: 12,
                      fill: Colors.text.default,
                      fontFamily: "IBM Plex Sans, serif",
                    }}
                  />
                  <YAxis
                    tick={{
                      fontSize: 12,
                      fill: Colors.text.default,
                      fontFamily: "IBM Plex Sans, serif",
                    }}
                  />
                  <Tooltip
                    labelFormatter={(label) => formatChartDate(label as string)}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={Colors.background.brand}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 250,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pb: 3,
                }}
              >
                <LoadingIndicator
                  variant="bar"
                  text="Fetching revenue data..."
                />
              </Box>
            )}
          </Card>
        </Grid>

        {/* Commission Chart */}
        <Grid item xs={12} md={6} lg={12}>
          <Card
            sx={{
              p: 3,
              bgcolor: Colors.background.light,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Commission Breakdown
              </Typography>
              <ButtonGroup>
                <Button
                  sx={{
                    padding: "5px",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  onClick={() => {
                    setTimePeriod("7days");
                  }}
                  variant={timePeriod === "7days" ? "filled" : "border"}
                >
                  7D
                </Button>
                <Button
                  sx={{
                    padding: "5px",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                  onClick={() => {
                    setTimePeriod("30days");
                  }}
                  variant={timePeriod === "30days" ? "filled" : "border"}
                >
                  30D
                </Button>
              </ButtonGroup>
            </Box>

            {finishedFetchingChartData ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueChartData}>
                  <CartesianGrid stroke={Colors.border.default} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    tick={{
                      fontSize: 12,
                      fill: Colors.text.default,
                      fontFamily: "IBM Plex Sans, serif",
                    }}
                  />
                  <YAxis
                    tick={{
                      fontSize: 12,
                      fill: Colors.text.default,
                      fontFamily: "IBM Plex Sans, serif",
                    }}
                  />
                  <Tooltip
                    labelFormatter={(label) => formatChartDate(label as string)}
                  />
                  <Bar dataKey="commission" fill={Colors.background.brand} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 250,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pb: 3,
                }}
              >
                <LoadingIndicator
                  variant="bar"
                  text="Fetching commission data..."
                />
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
      {/* Payouts Section */}
      <Card
        sx={{
          p: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Pending Payouts
          </Typography>
          <Button variant="filled">Process All</Button>
        </Box>
        <TextField
          fullWidth
          label="Search by restaurant..."
          placeholder="Search restaurants"
          value={payoutSearch}
          onChange={(e) => setPayoutSearch(e.target.value)}
          size="small"
          sx={{ mb: 2 }}
        />
        {pendingPayouts && pendingPayouts.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {pendingPayouts
              .filter((p) =>
                p.restaurantName
                  .toLowerCase()
                  .includes(payoutSearch.toLowerCase()),
              )
              .map((payout) => (
                <Box
                  key={payout.restaurantId}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "rgba(0, 0, 0, 0.02)",
                    borderRadius: 1,
                    border: `1px solid ${Colors.border.default}`,
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {payout.restaurantName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: Colors.text.placeholder }}
                    >
                      ID: {payout.restaurantId}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      ${payout.amountDue.toFixed(2)}
                    </Typography>
                    <Button variant="filled" sx={{ p: "10px" }}>
                      Process
                    </Button>
                  </Box>
                </Box>
              ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: Colors.text.placeholder }}>
            No pending payouts found
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default AdminFinancePage;
