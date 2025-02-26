import { Box, Grid2 as Grid } from "@mui/material";
import { useEffect, useState } from "react";

import RestaurantView from "../features/menu/components/RestaurantView";
import LoadingIndicator from "../features/menu/components/LoadingIndicator";
import { getAllRestaurants } from "../services/restaurant.service";
import { Restaurant } from "../types/restaurants";

const AllRestaurantsPage = () => {
  const [restaurant, setRestaurant] = useState<Restaurant[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        if (!data) {
          setError("Restaurant not found.");
        } else {
          setRestaurant(data);
        }
      } catch (error) {
        console.error("Error fetching Restaurant", error);
      }
    };

    fetchRestaurants();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!restaurant) {
    return (
      <div>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <Box
      sx={{
        paddingTop: "100px",
        paddingX: "2rem",
        display: "flex",
        flexDirection: { sm: "column", xs: "column", lg: "row" },
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        width: "100%",
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        {restaurant.map((restaurant) => (
          <RestaurantView key={restaurant.name} restaurant={restaurant} />
        ))}
      </Grid>
    </Box>
  );
};

export default AllRestaurantsPage;
