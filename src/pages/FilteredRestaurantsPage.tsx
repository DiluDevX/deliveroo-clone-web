import { Box, Grid2 as Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";

import RestaurantView from "../features/menu/components/RestaurantView";
import LoadingIndicator from "../features/menu/components/LoadingIndicator";
import Button from "../features/menu/components/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Colors } from "../theme/colors";
import { getFilteredRestaurants } from "../services/restaurant.service";
import { Restaurant } from "../types/restaurants";
import NotFoundScreen from "../features/menu/components/NotFoundScreen";

const FilteredRestaurantsPage = () => {
  const [loading, setLoading] = useState(true);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    [],
  );
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() ?? "";

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data: Restaurant[] = await delay(1000).then(() =>
          getFilteredRestaurants(),
        );
        if (!searchQuery) {
          setFilteredRestaurants(data);
        } else {
          const filterRestaurants = data.filter((restaurant: Restaurant) =>
            restaurant.name.toLowerCase().includes(searchQuery),
          );
          setFilteredRestaurants(filterRestaurants);
        }
      } catch (error) {
        console.error("Error fetching restaurants", error);
        setFilteredRestaurants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [searchQuery]);

  if (loading) {
    return (
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingIndicator />
      </Box>
    );
  }

  let content;
  if (filteredRestaurants.length === 0) {
    content = <NotFoundScreen text={"Restaurants not found"} />;
  } else {
    content = filteredRestaurants.map((restaurant) => (
      <RestaurantView key={restaurant.name} restaurant={restaurant} />
    ));
  }

  return (
    <Box
      sx={{
        paddingTop: "4rem",
        paddingX: "2rem 2rem",
        paddingLeft: { md: "6rem", lg: "8rem" },
        display: "flex",
        flexDirection: { sm: "column", xs: "column", lg: "column" },
        flexWrap: "wrap",

        width: { xs: "100%", sm: "100%", md: "90%", lg: "90%" },
        height: "auto",
      }}
    >
      <Box sx={{ paddingBottom: "0.5rem" }}>
        <Button
          variant="border"
          PrefixComponent={<ArrowBackIcon sx={{ height: "1.3rem" }} />}
          onClick={() => window.history.back()}
          sx={{
            "&:hover": {
              border: "none",
            },
            border: "none",
            mt: 4,
            color: Colors.background.brand,
            fontSize: "1rem",
            fontWeight: "normal",
            left: "0",
          }}
        >
          Back
        </Button>
      </Box>
      <Grid container>{content}</Grid>
    </Box>
  );
};

export default FilteredRestaurantsPage;
