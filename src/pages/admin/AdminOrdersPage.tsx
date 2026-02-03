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

// Mock data for development
const mockOrders = [
  {
    id: "ORD-001",
    userId: "John Doe",
    restaurantId: "Pizza Palace",
    totalAmount: 45.99,
    status: "Done",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "ORD-002",
    userId: "Jane Smith",
    restaurantId: "Sushi Station",
    totalAmount: 62.5,
    status: "Done",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "ORD-003",
    userId: "Mike Johnson",
    restaurantId: "Burger Barn",
    totalAmount: 38.75,
    status: "pending",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "ORD-004",
    userId: "Sarah Williams",
    restaurantId: "Taco Fiesta",
    totalAmount: 28.99,
    status: "Done",
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    id: "ORD-005",
    userId: "Robert Brown",
    restaurantId: "Dragon Wok",
    totalAmount: 55.0,
    status: "pending",
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: "ORD-006",
    userId: "Emily Davis",
    restaurantId: "Curry House",
    totalAmount: 42.3,
    status: "Done",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "ORD-007",
    userId: "David Miller",
    restaurantId: "Pasta Paradise",
    totalAmount: 51.75,
    status: "cancelled",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "ORD-008",
    userId: "Lisa Anderson",
    restaurantId: "Greek Taverna",
    totalAmount: 39.99,
    status: "Done",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ORD-009",
    userId: "Chris Taylor",
    restaurantId: "Pizza Palace",
    totalAmount: 47.5,
    status: "pending",
    createdAt: new Date(Date.now() - 20 * 60 * 1000),
  },
  {
    id: "ORD-010",
    userId: "Amanda White",
    restaurantId: "Sushi Station",
    totalAmount: 68.99,
    status: "Done",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

const AdminOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders] = useState(mockOrders);

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
      o.restaurantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.totalAmount.toString().includes(searchTerm.toLowerCase()) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(o.createdAt)
        .toLocaleDateString()
        .includes(searchTerm.toLowerCase()),
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
              {filteredOrders.slice(0, 10).map((order) => (
                <TableRow key={order.id}>
                  <TableCell sx={{ fontWeight: "bold" }}>{order.id}</TableCell>
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>{order.restaurantId}</TableCell>
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
                    {new Date(order.createdAt).toLocaleDateString()}
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
