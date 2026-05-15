import { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Restaurant } from "../../../types/restaurants";
import { createRestaurant } from "../../../services/restaurant.service";
import {
  showErrorSnackbar,
  showSuccessSnackbar,
} from "../../../utils/notifications";
import { textFieldStyles } from "../../../utils/MuiTextFieldCustom";
import Button from "./Button";
import { Colors } from "../../../theme/colors";
import {
  createNewRestaurantAdmin,
  updateRestaurantAdmin,
} from "../../../services/admin.service";
import { useAppSelector } from "../../../store/hooks/cartHooks";

const optionalNonNegativeNumberString = (fieldName: string) =>
  z
    .string()
    .trim()
    .refine((value) => {
      if (!value) return true;
      const parsedValue = Number(value);
      return Number.isFinite(parsedValue) && parsedValue >= 0;
    }, `${fieldName} must be a positive number`);

const optionalNonNegativeIntegerString = (fieldName: string) =>
  z
    .string()
    .trim()
    .refine((value) => {
      if (!value) return true;
      const parsedValue = Number(value);
      return (
        Number.isInteger(parsedValue) &&
        Number.isFinite(parsedValue) &&
        parsedValue >= 0
      );
    }, `${fieldName} must be a positive whole number`);

const restaurantFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Restaurant name is required")
    .max(200, "Restaurant name is too long")
    .regex(
      /^[a-zA-Z0-9\s'&\-.,]+$/,
      "Restaurant name contains unsupported characters",
    ),
  cuisine: z
    .string()
    .trim()
    .min(1, "Cuisine type is required")
    .max(100, "Cuisine type is too long")
    .regex(/^[a-zA-Z\s'\-&]+$/, "Cuisine contains unsupported characters"),
  image: z
    .string()
    .trim()
    .min(1, "Image URL is required")
    .url("Image must be a valid URL"),
  description: z.string().trim(),
  tags: z.string().trim(),
  openingAt: z.string().trim().min(1, "Opening time is required"),
  closingAt: z.string().trim().min(1, "Closing time is required"),
  minimumValue: z
    .string()
    .trim()
    .refine(
      (val) => Number.isFinite(Number(val)) && Number(val) >= 0,
      "Minimum value must be a positive number",
    ),
  deliveryCharge: z
    .string()
    .trim()
    .refine(
      (val) => Number.isFinite(Number(val)) && Number(val) >= 0,
      "Delivery charge must be a positive number",
    ),
  rating: optionalNonNegativeNumberString("Rating"),
  totalOrders: optionalNonNegativeIntegerString("Total orders"),
  totalRevenue: optionalNonNegativeNumberString("Total revenue"),
  status: z.enum(["active", "disabled"]),
  adminEmail: z.string().trim().email({ message: "Invalid email" }),
  adminPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter" })
    .regex(/[0-9]/, { message: "Must include a number" }),
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

const resetFormData = (): CreateRestaurantFormData => ({
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

const parseOptionalNumber = (value: string) => (value ? Number(value) : 0);

const parseOptionalInteger = (value: string) =>
  value ? Number.parseInt(value, 10) : 0;

const buildRestaurantPayload = (
  data: CreateRestaurantFormData,
): Partial<Restaurant> => ({
  name: data.name,
  image: data.image,
  description: data.description,
  tags: data.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean),
  openingAt: data.openingAt,
  closingAt: data.closingAt,
  minimumValue: Number(data.minimumValue),
  deliveryCharge: Number(data.deliveryCharge),
  cuisine: data.cuisine,
  rating: parseOptionalNumber(data.rating),
  totalOrders: parseOptionalInteger(data.totalOrders),
  totalRevenue: parseOptionalNumber(data.totalRevenue),
  status: data.status === "active" ? "ACTIVE" : "DISABLED",
});

const createRestaurantWithAdmin = async (
  data: CreateRestaurantFormData,
  isPlatformAdmin: boolean,
): Promise<Restaurant> => {
  const user = await createNewRestaurantAdmin(
    data.adminEmail,
    data.adminPassword,
    data.name,
    isPlatformAdmin,
  );

  if (!user?.id) {
    throw new Error("Failed to create restaurant admin user");
  }

  const restaurant = await createRestaurant({
    ...buildRestaurantPayload(data),
    adminId: user.id,
  });

  if (!restaurant) {
    throw new Error("Failed to create restaurant");
  }

  const res = await updateRestaurantAdmin(user.id, {
    restaurantId: restaurant.id,
  });

  if (!res || !res.restaurantId) {
    throw new Error("Failed to link restaurant admin to restaurant");
  }

  return restaurant;
};

const AddRestaurantModal = ({
  open,
  onClose,
  onSuccess,
}: AddRestaurantModalProps) => {
  const [formData, setFormData] = useState<CreateRestaurantFormData>(() =>
    resetFormData(),
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isPlatformAdmin = useAppSelector(
    (state) => state.auth.user?.role === "platform_admin",
  );

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

    setLoading(true);
    try {
      await createRestaurantWithAdmin(validationResult.data, isPlatformAdmin);
      showSuccessSnackbar("Restaurant created successfully");

      setFormData(resetFormData());

      onClose();
      onSuccess();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create restaurant";
      setError(message);
      showErrorSnackbar(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setError("");
    onClose();
    setFormData(resetFormData());
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "right",
            pt: "15px",
            gap: "1rem",
          }}
        >
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
            {loading ? <CircularProgress size={20} /> : null}
            {loading ? "Creating..." : "Create Restaurant"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddRestaurantModal;
