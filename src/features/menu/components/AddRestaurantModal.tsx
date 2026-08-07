import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  showErrorSnackbar,
  showSuccessSnackbar,
} from "../../../utils/notifications";
import { textFieldStyles } from "../../../utils/MuiTextFieldCustom";
import Button from "./Button";
import { Colors } from "../../../theme/colors";
import { provisionRestaurant } from "../../../services/admin.service";
import { restaurantFormSchema } from "../validations/restaurant-form.schema";

interface AddRestaurantModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface CreateRestaurantFormData {
  name: string;
  cuisine: string;
  image: string;
  address: string;
  description: string;
  tags: string;
  openingAt: string;
  closingAt: string;
  minimumValue: string;
  deliveryCharge: string;
  commissionPercentage: string;
  ownerFirstName: string;
  ownerLastName: string;
  adminEmail: string;
  adminPassword: string;
}

const resetFormData = (): CreateRestaurantFormData => ({
  name: "",
  cuisine: "",
  image: "",
  address: "",
  description: "",
  tags: "",
  openingAt: "09:00",
  closingAt: "21:00",
  minimumValue: "0",
  deliveryCharge: "2.99",
  commissionPercentage: "15",
  ownerFirstName: "",
  ownerLastName: "",
  adminEmail: "",
  adminPassword: "",
});

const buildRestaurantPayload = (data: CreateRestaurantFormData) => ({
  name: data.name,
  image: data.image,
  address: data.address || undefined,
  description: data.description || undefined,
  tags: data.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean),
  openingAt: data.openingAt,
  closingAt: data.closingAt,
  minimumValue: Number(data.minimumValue),
  deliveryCharge: Number(data.deliveryCharge),
  commissionPercentage: Number(data.commissionPercentage),
  cuisine: data.cuisine,
});

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
  const [provisioningId, setProvisioningId] = useState(() =>
    crypto.randomUUID(),
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
      await provisionRestaurant({
        provisioningId,
        restaurant: buildRestaurantPayload(validationResult.data),
        owner: {
          firstName: validationResult.data.ownerFirstName,
          lastName: validationResult.data.ownerLastName,
          email: validationResult.data.adminEmail,
          password: validationResult.data.adminPassword,
        },
      });
      showSuccessSnackbar("Restaurant created successfully");

      setFormData(resetFormData());
      setProvisioningId(crypto.randomUUID());

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
    setProvisioningId(crypto.randomUUID());
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
            label="Owner First Name"
            name="ownerFirstName"
            value={formData.ownerFirstName}
            onChange={handleInputChange}
            size="small"
            disabled={loading}
          />
          <TextField
            sx={{ ...textFieldStyles, flex: 1 }}
            label="Owner Last Name"
            name="ownerLastName"
            value={formData.ownerLastName}
            onChange={handleInputChange}
            size="small"
            disabled={loading}
          />
          <TextField
            sx={{ ...textFieldStyles, flex: 1 }}
            label="Owner Email"
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
            label="Owner Password"
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
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            fullWidth
            size="small"
            placeholder="Restaurant address"
            disabled={loading}
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
          <TextField
            sx={{ ...textFieldStyles }}
            label="Platform Commission (%)"
            name="commissionPercentage"
            type="number"
            value={formData.commissionPercentage}
            onChange={handleInputChange}
            fullWidth
            size="small"
            disabled={loading}
            inputProps={{ step: "0.1", min: "0", max: "100" }}
          />
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
