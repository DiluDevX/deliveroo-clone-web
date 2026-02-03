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

interface AddRestaurantModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  cuisine: string;
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
    setError("");

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

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await createRestaurant({
      //   name: formData.name,
      //   cuisine: formData.cuisine,
      //   rating: parseFloat(formData.rating) || 0,
      //   totalOrders: parseInt(formData.totalOrders) || 0,
      //   totalRevenue: parseFloat(formData.totalRevenue) || 0,
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Reset form
      setFormData({
        name: "",
        cuisine: "",
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
    if (!loading) {
      setFormData({
        name: "",
        cuisine: "",
        rating: "",
        totalOrders: "",
        totalRevenue: "",
        status: "active",
      });
      setError("");
      onClose();
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
