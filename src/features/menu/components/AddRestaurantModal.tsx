import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Colors } from "../../../theme";
import { Restaurant } from "../../../types/restaurants";
import { createRestaurant } from "../../../services/restaurant.service";

interface AddRestaurantModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  cuisine: string;
  image: string;
  description: string;
  tags: string;
  openingAt: string;
  closingAt: string;
  minimumValue: string;
  deliveryCharge: string;
  rating: string;
  totalOrders: string;
  totalRevenue: string;
  status: string;
}

const AddRestaurantModal = ({
  open,
  onClose,
  onSuccess,
}: AddRestaurantModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    cuisine: "",
    image: "",
    description: "",
    tags: "",
    openingAt: "09:00",
    closingAt: "21:00",
    minimumValue: "0",
    deliveryCharge: "2.99",
    rating: "",
    totalOrders: "",
    totalRevenue: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const newRestaurant: Partial<Restaurant> = {
      name: formData.name,
      image: formData.image,
      description: formData.description,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      openingAt: formData.openingAt,
      closingAt: formData.closingAt,
      minimumValue: formData.minimumValue,
      deliveryCharge: formData.deliveryCharge,
      cuisine: formData.cuisine,
      rating: formData.rating ? parseFloat(formData.rating) : 0,
      totalOrders: formData.totalOrders ? parseInt(formData.totalOrders) : 0,
      totalRevenue: formData.totalRevenue
        ? parseFloat(formData.totalRevenue)
        : 0,
      status: formData.status === "active" ? "active" : "disabled",
    };

    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Restaurant name is required");
      return;
    }

    const nameRegex = /^[a-zA-Z0-9\s]+$/;
    if (!nameRegex.test(formData.name)) {
      setError("Restaurant name can only contain letters and numbers");
      return;
    }

    if (!formData.cuisine.trim()) {
      setError("Cuisine type is required");
      return;
    }

    const cuisineRegex = /^[a-zA-Z\s]+$/;
    if (!cuisineRegex.test(formData.cuisine)) {
      setError("Cuisine can only contain letters");
      return;
    }

    if (!formData.image.trim()) {
      setError("Image URL is required");
      return;
    }

    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(formData.image)) {
      setError("Image must be a valid URL (http:// or https://)");
      return;
    }

    if (!formData.openingAt) {
      setError("Opening time is required");
      return;
    }

    if (!formData.closingAt) {
      setError("Closing time is required");
      return;
    }

    const minValue = parseFloat(formData.minimumValue);
    if (isNaN(minValue) || minValue < 0) {
      setError("Minimum value must be a positive number");
      return;
    }

    const deliveryCharge = parseFloat(formData.deliveryCharge);
    if (isNaN(deliveryCharge) || deliveryCharge < 0) {
      setError("Delivery charge must be a positive number");
      return;
    }

    setLoading(true);
    try {
      const result = await createRestaurant(newRestaurant);
      if (!result) {
        throw new Error("Failed to create restaurant.");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Reset form
      setFormData({
        name: "",
        cuisine: "",
        image: "",
        description: "",
        tags: "",
        openingAt: "09:00",
        closingAt: "21:00",
        minimumValue: "0",
        deliveryCharge: "2.99",
        rating: "",
        totalOrders: "",
        totalRevenue: "",
        status: "active",
      });

      onClose();
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create restaurant",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
    if (!loading) {
      setFormData({
        name: "",
        cuisine: "",
        image: "",
        description: "",
        tags: "",
        openingAt: "09:00",
        closingAt: "21:00",
        minimumValue: "0",
        deliveryCharge: "2.99",
        rating: "",
        totalOrders: "",
        totalRevenue: "",
        status: "active",
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", color: Colors.text.default }}>
        Add New Restaurant
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Restaurant Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            size="small"
            placeholder="e.g., Pizza Palace"
            disabled={loading}
          />
          <TextField
            label="Cuisine Type"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleInputChange}
            fullWidth
            size="small"
            placeholder="e.g., Italian"
            disabled={loading}
          />
          <TextField
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            fullWidth
            size="small"
            placeholder="e.g., https://example.com/image.jpg"
            disabled={loading}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            size="small"
            placeholder="Brief description of the restaurant"
            disabled={loading}
            multiline
            rows={2}
          />
          <TextField
            label="Tags (comma-separated)"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            fullWidth
            size="small"
            placeholder="e.g., fast-food, delivery, budget-friendly"
            disabled={loading}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Opening Time"
              name="openingAt"
              type="time"
              value={formData.openingAt}
              onChange={handleInputChange}
              size="small"
              disabled={loading}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Closing Time"
              name="closingAt"
              type="time"
              value={formData.closingAt}
              onChange={handleInputChange}
              size="small"
              disabled={loading}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Minimum Order Value"
              name="minimumValue"
              type="number"
              value={formData.minimumValue}
              onChange={handleInputChange}
              fullWidth
              size="small"
              placeholder="e.g., 50"
              disabled={loading}
              inputProps={{ step: "0.01", min: "0" }}
            />
            <TextField
              label="Delivery Charge"
              name="deliveryCharge"
              type="number"
              value={formData.deliveryCharge}
              onChange={handleInputChange}
              fullWidth
              size="small"
              placeholder="e.g., 2.99"
              disabled={loading}
              inputProps={{ step: "0.01", min: "0" }}
            />
          </Box>
          <FormControl fullWidth size="small" disabled={loading}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              label="Status"
              value={formData.status}
              onChange={handleSelectChange}
              fullWidth
              size="small"
              disabled={loading}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Disabled</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ bgcolor: Colors.background.brand }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress
              size={20}
              sx={{ mr: 1, color: Colors.background.brand }}
            />
          ) : null}
          {loading ? "Creating..." : "Add Restaurant"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRestaurantModal;
