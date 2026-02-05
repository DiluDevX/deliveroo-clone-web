import { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Restaurant } from "../../../types/restaurants";
import { createRestaurant } from "../../../services/restaurant.service";
import { showErrorSnackbar } from "../../../utils/notifications";
import { textFieldStyles } from "../../../utils/MuiTextFieldCustom";
import Button from "./Button";
import { Colors } from "../../../theme/colors";

const restaurantFormSchema = z.object({
  name: z
    .string()
    .min(1, "Restaurant name is required")
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      "Restaurant name can only contain letters and numbers",
    ),
  cuisine: z
    .string()
    .min(1, "Cuisine type is required")
    .regex(/^[a-zA-Z\s]+$/, "Cuisine can only contain letters"),
  image: z
    .string()
    .min(1, "Image URL is required")
    .url("Image must be a valid URL"),
  description: z.string(),
  tags: z.string(),
  openingAt: z.string().min(1, "Opening time is required"),
  closingAt: z.string().min(1, "Closing time is required"),
  minimumValue: z
    .string()
    .refine(
      (val) =>
        !Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0,
      "Minimum value must be a positive number",
    ),
  deliveryCharge: z
    .string()
    .refine(
      (val) =>
        !Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0,
      "Delivery charge must be a positive number",
    ),
  rating: z.string(),
  totalOrders: z.string(),
  totalRevenue: z.string(),
  status: z.enum(["active", "disabled"]),
  adminEmail: z.string(),
  adminPassword: z.string(),
});

interface AddRestaurantModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface CreateRestaurantFormData {
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
  status: "active" | "disabled";
  adminEmail: string;
  adminPassword: string;
}

const AddRestaurantModal = ({
  open,
  onClose,
  onSuccess,
}: AddRestaurantModalProps) => {
  const [formData, setFormData] = useState<CreateRestaurantFormData>({
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
    adminEmail: "",
    adminPassword: "",
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

  const handleSubmit = async () => {
    setError("");

    // Validate form data with Zod
    const validationResult = restaurantFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      setError(firstError.message);
      return;
    }

    const validatedData = validationResult.data;

    const newRestaurant: Partial<Restaurant> = {
      name: validatedData.name,
      image: validatedData.image,
      description: validatedData.description,
      tags: validatedData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      openingAt: validatedData.openingAt,
      closingAt: validatedData.closingAt,
      minimumValue: validatedData.minimumValue,
      deliveryCharge: validatedData.deliveryCharge,
      cuisine: validatedData.cuisine,
      rating: validatedData.rating
        ? Number.parseFloat(validatedData.rating)
        : 0,
      totalOrders: validatedData.totalOrders
        ? Number.parseInt(validatedData.totalOrders)
        : 0,
      totalRevenue: validatedData.totalRevenue
        ? Number.parseFloat(validatedData.totalRevenue)
        : 0,
      status: validatedData.status === "active" ? "active" : "disabled",
    };

    setLoading(true);
    try {
      await createRestaurant(newRestaurant);

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
        adminEmail: "",
        adminPassword: "",
      });

      onClose();
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create restaurant",
      );
      showErrorSnackbar("Something went wrong");
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
        adminEmail: "",
        adminPassword: "",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "0.75rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle>Add New Restaurant</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            sx={{ ...textFieldStyles }}
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
            sx={{ ...textFieldStyles }}
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
            sx={{ ...textFieldStyles, flex: 1 }}
            label="Admin Email"
            name="adminEmail"
            type="email"
            value={formData.adminEmail}
            onChange={handleInputChange}
            size="small"
            placeholder="(restaurantName)-admin@gmail.com"
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            sx={{ ...textFieldStyles, flex: 1 }}
            label="Admin Password"
            name="adminPassword"
            type="password"
            value={formData.adminPassword}
            onChange={handleInputChange}
            size="small"
            disabled={loading}
            placeholder="Example@1234"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            sx={{ ...textFieldStyles }}
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
            sx={{ ...textFieldStyles }}
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
            sx={{ ...textFieldStyles }}
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
              sx={{ ...textFieldStyles, flex: 1 }}
              label="Opening Time"
              name="openingAt"
              type="time"
              value={formData.openingAt}
              onChange={handleInputChange}
              size="small"
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              sx={{ ...textFieldStyles, flex: 1 }}
              label="Closing Time"
              name="closingAt"
              type="time"
              value={formData.closingAt}
              onChange={handleInputChange}
              size="small"
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              sx={{ ...textFieldStyles }}
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
              sx={{ ...textFieldStyles }}
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
        </Box>
        <DialogActions>
          <Button
            variant="border"
            onClick={handleClose}
            disabled={loading}
            sx={{ color: Colors.background.brand }}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ color: Colors.text.inverse }}
          >
            {loading ? <CircularProgress size={20} sx={{}} /> : null}
            {loading ? "Creating..." : "Create Restaurant"}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default AddRestaurantModal;
