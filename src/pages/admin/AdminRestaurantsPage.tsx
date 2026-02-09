import { useEffect, useState, useMemo } from "react";
import { Box, Card, Typography, Chip, TextField } from "@mui/material";
import {
  Add,
  SearchOutlined,
  Edit,
  Delete,
  ToggleOn,
} from "@mui/icons-material";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Colors } from "../../theme";
import Button from "../../features/menu/components/Button";
import AddRestaurantModal from "../../features/menu/components/AddRestaurantModal";
import { getAllRestaurants } from "../../services/restaurant.service";
import { Restaurant } from "../../types/restaurants";
import Table from "../../features/menu/components/Table";

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

const AdminRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const handleAddRestaurant = () => {
    setModalOpen(true);
  };

  const handleModalClose = async () => {
    const data = await getAllRestaurants();
    setRestaurants(data || []);
    setModalOpen(false);
  };

  useEffect(() => {
    async function fetchRestaurants() {
      const data = await getAllRestaurants();
      setRestaurants(data || []);
    }
    fetchRestaurants();
  }, []);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    return restaurants.filter(
      (r) =>
        r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.rating?.toString().includes(searchTerm.toLowerCase()) ||
        r.totalOrders?.toString().includes(searchTerm.toLowerCase()) ||
        r.totalRevenue?.toString().includes(searchTerm.toLowerCase()) ||
        r.status?.toString().includes(searchTerm.toLowerCase()),
    );
  }, [restaurants, searchTerm]);

  // Define columns
  const columns = useMemo<ColumnDef<Restaurant>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Restaurant Name",
        cell: (info) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                overflow: "hidden",
                bgcolor: Colors.background.brand,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {info.row.original.image ? (
                <img
                  src={info.row.original.image}
                  alt={info.getValue<string>()}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography sx={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                  {info.getValue<string>()?.charAt(0)}
                </Typography>
              )}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: "600", fontSize: "0.95rem" }}>
                {info.getValue<string>() || "N/A"}
              </Typography>
              <Typography
                sx={{ fontSize: "0.75rem", color: Colors.text.placeholder }}
              >
                {info.row.original.cuisine || "Cuisine"}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: (info) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              sx={{ fontWeight: "600", color: Colors.background.brand }}
            >
              {(info.getValue<number>() ?? 0).toFixed(1)}
            </Typography>
            <Typography sx={{ color: Colors.text.placeholder }}>/ 5</Typography>
          </Box>
        ),
      },
      {
        accessorKey: "totalOrders",
        header: "Orders",
        cell: (info) => (
          <Typography sx={{ fontWeight: "500", color: Colors.text.default }}>
            {info.getValue<number>() ?? 0}
          </Typography>
        ),
      },
      {
        accessorKey: "totalRevenue",
        header: "Revenue",
        cell: (info) => (
          <Typography
            sx={{ fontWeight: "600", color: Colors.background.brand }}
          >
            ${(info.getValue<number>() ?? 0).toFixed(2)}
          </Typography>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => (
          <Chip
            label={info.getValue<string>() || "inactive"}
            color={info.getValue<string>() === "active" ? "success" : "error"}
            size="small"
            sx={{
              maxWidth: "60px",
              minWidth: "60px",
              fontSize: "0.7rem",
            }}
          />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Button
              borderOff={true}
              sx={{
                color: Colors.background.brand,
                fontSize: "0.9rem",
              }}
            >
              <Edit sx={{ fontSize: "1rem", mr: 0.5, ml: -2 }} />
              Edit
            </Button>
            <Button
              borderOff={true}
              sx={{ color: Colors.text.dark, fontSize: "0.9rem" }}
            >
              <ToggleOn sx={{ fontSize: "1rem", mr: 0.5 }} />
              Disable
            </Button>
            <Button
              borderOff={true}
              sx={{ color: Colors.text.error, fontSize: "0.9rem" }}
            >
              <Delete sx={{ fontSize: "1rem", mr: 0.5 }} />
              Delete
            </Button>
          </Box>
        ),
      },
    ],
    [],
  );

  // Create table instance
  const table = useReactTable({
    data: filteredData,
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
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "700",
              mb: 1,
              fontSize: { xs: "1.5rem", sm: "2rem" },
              color: Colors.text.default,
            }}
          >
            Restaurants
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: Colors.text.placeholder,
              fontSize: "0.95rem",
            }}
          >
            Manage and monitor all restaurants on the platform
          </Typography>
        </Box>
        <Button
          sx={{
            bgcolor: Colors.background.brand,
            color: "white",
            textTransform: "none",
            fontWeight: "600",
            px: 3,
            py: 1.2,
            borderRadius: "8px",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: Colors.background.brand,
              opacity: 0.9,
              transform: "translateY(-2px)",
              boxShadow: `0 8px 16px ${Colors.background.brand}33`,
            },
          }}
          onClick={handleAddRestaurant}
        >
          <Add sx={{ fontSize: "1.2rem" }} />
          Add Restaurant
        </Button>
      </Box>

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
          placeholder="Search restaurants by name, cuisine, or rating..."
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
          filteredData={filteredData}
          columns={columns}
          pagination={pagination}
          setPagination={setPagination}
          enableSorting
          enableColumnFiltering
        />

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
              filteredData.length,
            )}{" "}
            of {filteredData.length} restaurants
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

      <AddRestaurantModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={() => {
          handleModalClose();
        }}
      />
    </Box>
  );
};

export default AdminRestaurantsPage;
