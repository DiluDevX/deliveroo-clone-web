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
import { Add, SearchOutlined } from "@mui/icons-material";
import { Colors } from "../../theme";
import Button from "../../features/menu/components/Button";
import AddRestaurantModal from "../../features/menu/components/AddRestaurantModal";

// Mock data for development
const mockRestaurants = [
  {
    id: "1",
    name: "Pizza Palace",
    cuisine: "Italian",
    rating: 4.8,
    totalOrders: 324,
    totalRevenue: 8540,
    status: "active",
  },
  {
    id: "2",
    name: "Burger Barn",
    cuisine: "American",
    rating: 4.5,
    totalOrders: 512,
    totalRevenue: 9876,
    status: "active",
  },
  {
    id: "3",
    name: "Sushi Station",
    cuisine: "Japanese",
    rating: 4.9,
    totalOrders: 287,
    totalRevenue: 7652,
    status: "active",
  },
  {
    id: "4",
    name: "Taco Fiesta",
    cuisine: "Mexican",
    rating: 4.6,
    totalOrders: 445,
    totalRevenue: 6234,
    status: "active",
  },
  {
    id: "5",
    name: "Pasta Paradise",
    cuisine: "Italian",
    rating: 4.7,
    totalOrders: 198,
    totalRevenue: 5432,
    status: "disabled",
  },
  {
    id: "6",
    name: "Dragon Wok",
    cuisine: "Chinese",
    rating: 4.4,
    totalOrders: 623,
    totalRevenue: 10234,
    status: "active",
  },
  {
    id: "7",
    name: "Curry House",
    cuisine: "Indian",
    rating: 4.6,
    totalOrders: 412,
    totalRevenue: 7845,
    status: "disabled",
  },
  {
    id: "8",
    name: "Greek Taverna",
    cuisine: "Greek",
    rating: 4.5,
    totalOrders: 267,
    totalRevenue: 5234,
    status: "active",
  },
];

const AdminRestaurantsPage = () => {
  const [restaurants] = useState(mockRestaurants);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddRestaurant = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleRestaurantAdded = () => {
    // TODO: Refresh restaurant list from API
    console.log("Restaurant added successfully");
  };

  useEffect(() => {
    async function fetchRestaurants() {
      // TODO: Replace with real API call
      // const data = await getAllRestaurants();
      // setRestaurants(data || []);
      // For now, using mock data
    }
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rating.toString().includes(searchTerm.toLowerCase()) ||
      r.totalOrders.toString().includes(searchTerm.toLowerCase()) ||
      r.totalRevenue.toString().includes(searchTerm.toLowerCase()) ||
      r.status.toString().includes(searchTerm.toLowerCase()),
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
          sx={{ bgcolor: Colors.background.brand }}
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
                    {restaurant.name}
                  </TableCell>
                  <TableCell>{restaurant.totalOrders}</TableCell>
                  <TableCell>
                    $ {restaurant.totalRevenue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={restaurant.status}
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
                      edit
                    </Button>
                    <Button
                      borderOff={true}
                      sx={{ color: Colors.text.disabled, fontSize: "0.9rem" }}
                    >
                      disable
                    </Button>
                    <Button
                      borderOff={true}
                      sx={{ color: Colors.text.error, fontSize: "0.9rem" }}
                    >
                      delete
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
        onSuccess={handleRestaurantAdded}
      />
    </Box>
  );
};

export default AdminRestaurantsPage;
