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
import { SearchOutlined, Add, Edit, Delete } from "@mui/icons-material";
import { Colors } from "../../theme";
import Button from "../../features/menu/components/Button";

const RestaurantMenuPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock menu data
  const mockMenuItems = [
    {
      id: "ITEM-001",
      name: "Margherita Pizza",
      category: "Pizza",
      price: "$12.99",
      available: true,
      preparationTime: "15 mins",
      popularity: 145,
    },
    {
      id: "ITEM-002",
      name: "Caesar Salad",
      category: "Salads",
      price: "$8.99",
      available: true,
      preparationTime: "5 mins",
      popularity: 98,
    },
    {
      id: "ITEM-003",
      name: "Pasta Carbonara",
      category: "Pasta",
      price: "$14.99",
      available: true,
      preparationTime: "20 mins",
      popularity: 112,
    },
    {
      id: "ITEM-004",
      name: "Garlic Bread",
      category: "Appetizers",
      price: "$5.99",
      available: false,
      preparationTime: "8 mins",
      popularity: 87,
    },
    {
      id: "ITEM-005",
      name: "Tiramisu",
      category: "Desserts",
      price: "$6.99",
      available: true,
      preparationTime: "0 mins",
      popularity: 64,
    },
  ];

  const filteredItems = mockMenuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
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
            Menu Management
          </Typography>
          <Typography variant="body2" sx={{ color: Colors.text.default }}>
            Manage your restaurant's menu items and pricing
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
        >
          <Add sx={{ mr: 1 }} />
          Add Item
        </Button>
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
          placeholder="Search by item name or category..."
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

      {/* Menu Table */}
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
                <TableCell>Item Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Prep Time</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ fontWeight: "bold" }}>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.available ? "Available" : "Unavailable"}
                      color={item.available ? "success" : "error"}
                      size="small"
                      sx={{ maxWidth: "90px", fontSize: "0.7rem" }}
                    />
                  </TableCell>
                  <TableCell>{item.preparationTime}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.popularity}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        borderOff={true}
                        sx={{
                          color: Colors.background.brand,
                          fontSize: "0.85rem",
                        }}
                      >
                        <Edit sx={{ fontSize: "1rem", mr: 0.5 }} />
                        Edit
                      </Button>
                      <Button
                        borderOff={true}
                        sx={{
                          color: Colors.text.error,
                          fontSize: "0.85rem",
                        }}
                      >
                        <Delete sx={{ fontSize: "1rem", mr: 0.5 }} />
                        Delete
                      </Button>
                    </Box>
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

export default RestaurantMenuPage;
