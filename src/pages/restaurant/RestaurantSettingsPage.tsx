import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button as MuiButton,
  Grid,
} from "@mui/material";
import { Colors } from "../../theme";

const RestaurantSettingsPage = () => {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Pizza Palace",
    cuisine: "Italian",
    description: "Authentic Italian pizza and pasta",
    phoneNumber: "+1 (555) 123-4567",
    email: "contact@pizzapalace.com",
    address: "123 Main St, New York, NY 10001",
  });

  const [operatingHours, setOperatingHours] = useState({
    monday: { open: "09:00", close: "23:00", closed: false },
    tuesday: { open: "09:00", close: "23:00", closed: false },
    wednesday: { open: "09:00", close: "23:00", closed: false },
    thursday: { open: "09:00", close: "23:00", closed: false },
    friday: { open: "09:00", close: "23:30", closed: false },
    saturday: { open: "10:00", close: "23:30", closed: false },
    sunday: { open: "10:00", close: "22:00", closed: false },
  });

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

  const handleInfoChange = (field: string, value: string) => {
    setRestaurantInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHourChange = (
    day: string,
    field: string,
    value: string | boolean,
  ) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof operatingHours],
        [field]: value,
      },
    }));
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body2" sx={{ color: Colors.text.default }}>
          Manage your restaurant information and preferences
        </Typography>
      </Box>

      {/* Restaurant Information */}
      <Card
        sx={{
          p: 4,
          mb: 4,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
          Restaurant Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Restaurant Name"
              value={restaurantInfo.name}
              onChange={(e) => handleInfoChange("name", e.target.value)}
              size="small"
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cuisine Type"
              value={restaurantInfo.cuisine}
              onChange={(e) => handleInfoChange("cuisine", e.target.value)}
              size="small"
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={restaurantInfo.description}
              onChange={(e) => handleInfoChange("description", e.target.value)}
              size="small"
              multiline
              rows={3}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={restaurantInfo.phoneNumber}
              onChange={(e) => handleInfoChange("phoneNumber", e.target.value)}
              size="small"
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={restaurantInfo.email}
              onChange={(e) => handleInfoChange("email", e.target.value)}
              size="small"
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={restaurantInfo.address}
              onChange={(e) => handleInfoChange("address", e.target.value)}
              size="small"
              sx={textFieldStyles}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Operating Hours */}
      <Card
        sx={{
          p: 4,
          mb: 4,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
          Operating Hours
        </Typography>
        {Object.entries(operatingHours).map(([day, hours]) => (
          <Grid container spacing={2} key={day} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={2}>
              <Typography
                sx={{
                  textTransform: "capitalize",
                  fontWeight: 500,
                  mt: 1,
                }}
              >
                {day}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Opens at"
                type="time"
                value={hours.open}
                onChange={(e) => handleHourChange(day, "open", e.target.value)}
                size="small"
                disabled={hours.closed}
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Closes at"
                type="time"
                value={hours.close}
                onChange={(e) => handleHourChange(day, "close", e.target.value)}
                size="small"
                disabled={hours.closed}
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <MuiButton
                  variant={hours.closed ? "contained" : "outlined"}
                  size="small"
                  onClick={() => handleHourChange(day, "closed", !hours.closed)}
                >
                  {hours.closed ? "Closed" : "Open"}
                </MuiButton>
              </Box>
            </Grid>
          </Grid>
        ))}
      </Card>

      {/* Save Button */}
      <Card
        sx={{
          p: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <MuiButton variant="outlined">Cancel</MuiButton>
        <MuiButton
          variant="contained"
          sx={{
            bgcolor: Colors.background.brand,
            color: "white",
            "&:hover": {
              bgcolor: Colors.background.brand,
              opacity: 0.9,
            },
          }}
        >
          Save Changes
        </MuiButton>
      </Card>
    </Box>
  );
};

export default RestaurantSettingsPage;
