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
} from "@mui/material";
import { Add, SearchOutlined, Edit, Delete, Power } from "@mui/icons-material";
import { Colors } from "../../theme";
import Button from "../../features/menu/components/Button";
import AddRestaurantModal from "../../features/menu/components/AddRestaurantModal";
import { getAllRestaurants } from "../../services/restaurant.service";
import { Restaurant } from "../../types/restaurants";

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

const AdminRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

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

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rating?.toString().includes(searchTerm.toLowerCase()) ||
      r.totalOrders?.toString().includes(searchTerm.toLowerCase()) ||
      r.totalRevenue?.toString().includes(searchTerm.toLowerCase()) ||
      r.status?.toString().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Restaurants
          </Typography>
          <Typography variant="body2" sx={{ color: Colors.text.default }}>
            Manage all restaurants on the platform
          </Typography>
        </Box>
        <Button
          sx={{
            bgcolor: Colors.background.brand,
            color: "white",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 1,
            "&:hover": {
              bgcolor: Colors.background.brand,
              opacity: 0.9,
            },
          }}
          onClick={handleAddRestaurant}
        >
          <Add sx={{ mr: 1 }} />
          Add Restaurant
        </Button>
      </Box>

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
          placeholder="Search restaurants by name..."
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
                <TableCell>Restaurant Name</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Revenue</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRestaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {restaurant.name || "N/A"}
                  </TableCell>
                  <TableCell>{restaurant.totalOrders ?? 0}</TableCell>
                  <TableCell>
                    $ {(restaurant.totalRevenue ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={restaurant.status || "inactive"}
                      color={
                        restaurant.status === "active" ? "success" : "error"
                      }
                      size="small"
                      sx={{
                        maxWidth: "60px",
                        minWidth: "60px",
                        fontSize: "0.7rem",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
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
                      <Edit sx={{ fontSize: "1rem", mr: 0.5 }} />
                      Edit
                    </Button>
                    <Button
                      borderOff={true}
                      sx={{ color: Colors.text.dark, fontSize: "0.9rem" }}
                    >
                      <Power sx={{ fontSize: "1rem", mr: 0.5 }} />
                      Disable
                    </Button>
                    <Button
                      borderOff={true}
                      sx={{ color: Colors.text.error, fontSize: "0.9rem" }}
                    >
                      <Delete sx={{ fontSize: "1rem", mr: 0.5 }} />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
