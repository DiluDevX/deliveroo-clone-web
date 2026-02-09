import { useEffect, useState, useMemo } from "react";
import { Box, Card, Typography, Chip, TextField, Tooltip } from "@mui/material";
import { SearchOutlined, Visibility } from "@mui/icons-material";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Colors } from "../../theme";
import Button from "../../features/menu/components/Button";
import Table from "../../features/menu/components/Table";
import { getAllOrders } from "../../services/order.service";
import { FetchedAllOrders } from "../../types/orders";

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "white",
    transition: "all 0.3s ease",
    "&:hover fieldset": {
      borderColor: Colors.background.brand,
    },
    "&.Mui-focused fieldset": {
      borderColor: Colors.background.brand,
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: Colors.background.brand,
      fontWeight: "500",
    },
  },
};

const AdminOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<FetchedAllOrders[]>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

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

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.restaurantId._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.totalAmount.toString().includes(searchTerm.toLowerCase()) ||
        o.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.restaurantId.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [orders, searchTerm]);

  const columns = useMemo<ColumnDef<FetchedAllOrders>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Order ID",
        cell: (info) => (
          <Tooltip title={info.getValue<string>()} arrow>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "0.9rem",
                maxWidth: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {info.getValue<string>()}
            </Typography>
          </Tooltip>
        ),
      },
      {
        accessorKey: "userId",
        header: "Customer",
        cell: (info) => (
          <Tooltip title={info.getValue<string>()} arrow>
            <Typography
              sx={{
                fontSize: "0.9rem",
                color: Colors.text.default,
                maxWidth: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {info.getValue<string>()}
            </Typography>
          </Tooltip>
        ),
      },
      {
        accessorFn: (row) => row.restaurantId.name,
        id: "restaurant",
        header: "Restaurant",
        cell: (info) => (
          <Tooltip title={info.getValue<string>()} arrow>
            <Typography
              sx={{
                fontSize: "0.9rem",
                color: Colors.text.default,
                maxWidth: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {info.getValue<string>()}
            </Typography>
          </Tooltip>
        ),
      },
      {
        accessorKey: "totalAmount",
        header: "Amount",
        cell: (info) => (
          <Typography
            sx={{ fontWeight: "600", color: Colors.background.brand }}
          >
            ${info.getValue<number>()?.toFixed(2)}
          </Typography>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => (
          <Chip
            label={info.getValue<string>()}
            color={getStatusColor(info.getValue<string>())}
            size="small"
            sx={{
              maxWidth: "80px",
              fontSize: "0.75rem",
            }}
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: (info) => (
          <Typography sx={{ fontSize: "0.9rem", color: Colors.text.default }}>
            {new Date(info.getValue<string>()).toISOString().split("T")[0]}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <Button
            borderOff={true}
            sx={{
              color: Colors.background.brand,
              fontSize: "0.85rem",
            }}
          >
            <Visibility sx={{ fontSize: "1rem", mr: 0.5 }} />
            View
          </Button>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "700",
            mb: 1,
            fontSize: { xs: "1.5rem", sm: "2rem" },
            color: Colors.text.default,
          }}
        >
          Orders
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: Colors.text.placeholder,
            fontSize: "0.95rem",
          }}
        >
          Manage and track all orders
        </Typography>
      </Box>

      {/* Search & Filter */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          bgcolor: "white",
          border: `1px solid ${Colors.border.default}`,
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by order ID, customer, or restaurant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchOutlined
                sx={{
                  mr: 1.5,
                  color: Colors.text.placeholder,
                  fontSize: "1.2rem",
                }}
              />
            ),
          }}
          size="small"
          sx={textFieldStyles}
        />
      </Card>

      {/* Orders Table */}
      <Card
        sx={{
          bgcolor: "white",
          border: `1px solid ${Colors.border.default}`,
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        }}
      >
        <Table
          filteredData={filteredOrders}
          columns={columns}
          pagination={pagination}
          setPagination={setPagination}
          enableSorting={true}
        />

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderTop: `1px solid ${Colors.border.default}`,
            bgcolor: Colors.background.light,
          }}
        >
          <Typography
            sx={{ fontSize: "0.9rem", color: Colors.text.placeholder }}
          >
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              filteredOrders.length,
            )}{" "}
            of {filteredOrders.length} orders
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              sx={{
                px: 2,
                py: 0.8,
                borderRadius: "6px",
                fontWeight: "500",
                color: Colors.text.inverse,
                bgcolor: Colors.background.brand,
              }}
            >
              Previous
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              sx={{
                px: 2,
                py: 0.8,
                borderRadius: "6px",
                fontWeight: "500",
                color: Colors.text.inverse,
                bgcolor: Colors.background.brand,
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default AdminOrdersPage;
