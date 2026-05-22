import { useState } from "react";
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
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import { Colors } from "../../theme";
import Button from "../../features/menu/components/Button";

const RestaurantOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const orders: Array<{
    id: string;
    customer: string;
    items: number;
    total: string;
    status: string;
    date: string;
    time: string;
  }> = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Ready":
        return "info";
      case "Preparing":
        return "warning";
      case "Pending":
        return "default";
      default:
        return "default";
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: Colors.background.brand,
      },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: Colors.background.brand,
      },
    },
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Orders
        </Typography>
        <Typography variant="body2" sx={{ color: Colors.text.default }}>
          Manage and track all orders for your restaurant
        </Typography>
      </Box>

      {/* Search */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by order ID or customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchOutlined sx={{ mr: 1, color: Colors.text.placeholder }} />
            ),
          }}
          size="small"
          sx={textFieldStyles}
        />
      </Card>

      {/* Orders Table */}
      <Card
        sx={{
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
          width: "100%",
          overflow: "auto",
        }}
      >
        <TableContainer sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(0, 0, 0, 0.05)" }}>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell sx={{ fontWeight: "bold" }}>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{ maxWidth: "80px", fontSize: "0.7rem" }}
                    />
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.time}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        borderOff={true}
                        sx={{
                          color: Colors.background.brand,
                          fontSize: "0.85rem",
                        }}
                      >
                        View
                      </Button>
                      <Button
                        borderOff={true}
                        sx={{
                          color: Colors.text.default,
                          fontSize: "0.85rem",
                        }}
                      >
                        Update
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography sx={{ color: Colors.text.placeholder }}>
                      No orders found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default RestaurantOrdersPage;
