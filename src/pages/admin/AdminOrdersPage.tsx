import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Tooltip,
} from "@mui/material";
import { SearchOutlined, Visibility } from "@mui/icons-material";
import { Colors } from "../../theme";
import Button from "../../features/menu/components/Button";
import { getAllOrders } from "../../services/order.service";
import { FetchedAllOrders } from "../../types/orders";

const AdminOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<FetchedAllOrders[]>([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
    };
    fetchAllOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.restaurantId._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.totalAmount.toString().includes(searchTerm.toLowerCase()) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.restaurantId.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Orders
        </Typography>
        <Typography variant="body2" sx={{ color: Colors.text.default }}>
          Manage and track all orders
        </Typography>
      </Box>

      {/* Search & Filter */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchOutlined
                  sx={{ mr: 1, color: Colors.text.placeholder }}
                />
              ),
            }}
            size="small"
          />
        </Box>
      </Card>

      {/* Orders Table */}
      <Card
        sx={{
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(0, 0, 0, 0.05)" }}>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Restaurant</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <Tooltip title={order.id} arrow>
                      <span
                        style={{
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                        }}
                      >
                        {order.id}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={order.userId} arrow>
                      <span
                        style={{
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                        }}
                      >
                        {order.userId}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={order.restaurantId.name} arrow>
                      <span
                        style={{
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                        }}
                      >
                        {order.restaurantId.name}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>${order.totalAmount?.toFixed(2)}</TableCell>
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
                  <TableCell>
                    {new Date(order.createdAt).toISOString().split("T")[0]}
                  </TableCell>
                  <TableCell
                    sx={{
                      pl: 0,
                      py: 1,
                      pr: 1,
                    }}
                  >
                    <Button
                      borderOff={true}
                      sx={{
                        color: Colors.background.brand,
                        fontSize: "0.9rem",
                      }}
                    >
                      <Visibility sx={{ fontSize: "1rem", mr: 0.5 }} />
                      view
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default AdminOrdersPage;
