import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Card,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import Button from "../../features/menu/components/Button";
import {
  getSingleRestaurant,
  updateRestaurant,
} from "../../services/restaurant.service";
import { useAppSelector } from "../../store/hooks/cartHooks";
import { Colors } from "../../theme";
import { Restaurant } from "../../types/restaurants";
import {
  showErrorSnackbar,
  showSuccessSnackbar,
} from "../../utils/notifications";

const SETTINGS_MANAGER_ROLES = ["super_admin", "admin"];
const RESTAURANT_IMAGE_FALLBACK =
  "https://assets.dilum.me/deliveroo-clone/svgs/NotFound.svg";

const settingsSchema = z.object({
  name: z.string().trim().min(1, "Restaurant name is required").max(200),
  cuisine: z.string().trim().max(100, "Cuisine is too long"),
  description: z.string().trim().max(1000, "Description is too long"),
  address: z.string().trim().max(500, "Address is too long"),
  image: z.string().url("Enter a valid image URL"),
  tags: z.string().max(300, "Tags are too long"),
  openingAt: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid opening time"),
  closingAt: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid closing time"),
  minimumValue: z
    .number({ invalid_type_error: "Minimum order must be a number" })
    .min(0, "Minimum order cannot be negative"),
  deliveryCharge: z
    .number({ invalid_type_error: "Delivery charge must be a number" })
    .min(0, "Delivery charge cannot be negative"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const defaultValues: SettingsFormValues = {
  name: "",
  cuisine: "",
  description: "",
  address: "",
  image: "",
  tags: "",
  openingAt: "",
  closingAt: "",
  minimumValue: 0,
  deliveryCharge: 0,
};

const toFormValues = (restaurant: Restaurant): SettingsFormValues => ({
  name: restaurant.name,
  cuisine: restaurant.cuisine ?? "",
  description: restaurant.description ?? "",
  address: restaurant.address ?? "",
  image: restaurant.image,
  tags: restaurant.tags.join(", "),
  openingAt: restaurant.openingAt,
  closingAt: restaurant.closingAt,
  minimumValue: Number(restaurant.minimumValue),
  deliveryCharge: Number(restaurant.deliveryCharge),
});

const RestaurantSettingsPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const restaurantId = user?.restaurantId;
  const canManageSettings = Boolean(
    user?.role === "restaurant_user" &&
      user.restaurantRole &&
      SETTINGS_MANAGER_ROLES.includes(user.restaurantRole),
  );
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });
  const imageUrl = useWatch({ control, name: "image" });
  const [hasImagePreviewError, setHasImagePreviewError] = useState(false);

  useEffect(() => {
    setHasImagePreviewError(false);
  }, [imageUrl]);

  useEffect(() => {
    if (!restaurantId) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadRestaurant = async () => {
      setIsLoading(true);
      setHasLoadError(false);
      const loadedRestaurant = await getSingleRestaurant(restaurantId);

      if (!isActive) return;

      if (!loadedRestaurant) {
        setHasLoadError(true);
        showErrorSnackbar("Failed to load restaurant settings");
      } else {
        setRestaurant(loadedRestaurant);
        reset(toFormValues(loadedRestaurant));
      }
      setIsLoading(false);
    };

    void loadRestaurant();

    return () => {
      isActive = false;
    };
  }, [reset, restaurantId]);

  const submitSettings = async (values: SettingsFormValues) => {
    if (!restaurantId || !canManageSettings) return;

    try {
      const updatedRestaurant = await updateRestaurant(restaurantId, {
        ...values,
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      setRestaurant(updatedRestaurant);
      reset(toFormValues(updatedRestaurant));
      showSuccessSnackbar("Restaurant settings updated");
    } catch {
      showErrorSnackbar("Failed to update restaurant settings");
    }
  };

  if (!restaurantId) {
    return (
      <Card sx={{ p: 4, border: `1px solid ${Colors.border.default}` }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Restaurant assignment missing
        </Typography>
        <Typography sx={{ color: Colors.text.lighter }}>
          This account must be assigned to a restaurant before viewing settings.
        </Typography>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ minHeight: 480, display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (hasLoadError || !restaurant) {
    return (
      <Card sx={{ p: 4, border: `1px solid ${Colors.border.default}` }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Settings unavailable
        </Typography>
        <Typography sx={{ color: Colors.text.lighter }}>
          The restaurant service could not load these settings.
        </Typography>
      </Card>
    );
  }

  const fieldProps = {
    disabled: !canManageSettings || isSubmitting,
    fullWidth: true,
    size: "small" as const,
  };

  return (
    <Box
      component="form"
      onSubmit={(event) => void handleSubmit(submitSettings)(event)}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
          Settings
        </Typography>
        <Typography sx={{ color: Colors.text.lighter }}>
          Manage {restaurant.name}&apos;s public restaurant information.
        </Typography>
      </Box>

      {!canManageSettings && (
        <Card
          sx={{
            p: 2,
            mb: 3,
            border: `1px solid ${Colors.border.default}`,
            bgcolor: Colors.background.defaultLight,
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            Restaurant settings are read-only for your staff role.
          </Typography>
        </Card>
      )}

      <Card
        sx={{
          p: { xs: 2.5, md: 4 },
          mb: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>
          Restaurant information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              {...fieldProps}
              label="Restaurant name"
              {...register("name")}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              {...fieldProps}
              label="Cuisine"
              {...register("cuisine")}
              error={Boolean(errors.cuisine)}
              helperText={errors.cuisine?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...fieldProps}
              label="Description"
              multiline
              rows={3}
              {...register("description")}
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...fieldProps}
              label="Address"
              {...register("address")}
              error={Boolean(errors.address)}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 800, mb: 1.5 }}>
              Restaurant image
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  md: "minmax(260px, 0.8fr) minmax(0, 1.2fr)",
                },
                alignItems: "start",
                gap: 3,
              }}
            >
              <Box
                component="img"
                src={
                  imageUrl && !hasImagePreviewError
                    ? imageUrl
                    : RESTAURANT_IMAGE_FALLBACK
                }
                alt={`${restaurant.name} preview`}
                onError={() => setHasImagePreviewError(true)}
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  borderRadius: 1,
                  border: `1px solid ${Colors.border.default}`,
                  bgcolor: Colors.background.default,
                }}
              />
              <Box>
                <TextField
                  {...fieldProps}
                  label="Restaurant image URL"
                  {...register("image")}
                  error={Boolean(errors.image)}
                  helperText={
                    errors.image?.message ??
                    "Paste a public image URL to update the preview."
                  }
                />
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 1.5, color: Colors.text.lighter }}
                >
                  Use a wide image so restaurant cards and the menu header crop
                  consistently.
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...fieldProps}
              label="Tags"
              placeholder="Mexican, Burritos, Nachos"
              {...register("tags")}
              error={Boolean(errors.tags)}
              helperText={errors.tags?.message}
            />
          </Grid>
        </Grid>
      </Card>

      <Card
        sx={{
          p: { xs: 2.5, md: 4 },
          mb: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>
          Standard operating hours
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...fieldProps}
              label="Opens at"
              type="time"
              InputLabelProps={{ shrink: true }}
              {...register("openingAt")}
              error={Boolean(errors.openingAt)}
              helperText={errors.openingAt?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...fieldProps}
              label="Closes at"
              type="time"
              InputLabelProps={{ shrink: true }}
              {...register("closingAt")}
              error={Boolean(errors.closingAt)}
              helperText={errors.closingAt?.message}
            />
          </Grid>
        </Grid>
      </Card>

      <Card
        sx={{
          p: { xs: 2.5, md: 4 },
          mb: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>
          Ordering and delivery
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...fieldProps}
              label="Minimum order value"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              {...register("minimumValue", { valueAsNumber: true })}
              error={Boolean(errors.minimumValue)}
              helperText={errors.minimumValue?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...fieldProps}
              label="Delivery charge"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              {...register("deliveryCharge", { valueAsNumber: true })}
              error={Boolean(errors.deliveryCharge)}
              helperText={errors.deliveryCharge?.message}
            />
          </Grid>
        </Grid>
      </Card>

      {canManageSettings && (
        <Card
          sx={{
            p: 2,
            bgcolor: Colors.background.light,
            border: `1px solid ${Colors.border.default}`,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          <Button
            type="button"
            variant="border"
            disabled={!isDirty || isSubmitting}
            onClick={() => reset(toFormValues(restaurant))}
            sx={{ px: 2, fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="filled"
            disabled={!isDirty || isSubmitting}
            sx={{ width: 132, px: 2, fontWeight: 700 }}
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </Card>
      )}
    </Box>
  );
};

export default RestaurantSettingsPage;
