import { getFilteredRestaurants } from "../services/restaurant/getFilteredRestaurants";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import RestaurantView from "../features/menu/components/RestaurantView";
import LoadingIndicator from "../features/menu/components/LoadingIndicator";
import { FilteredRestaurant } from "../types/restaurants";
import Button from "../features/menu/components/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Colors } from "../theme/colors";

const FilteredRestaurantsPage = () => {
  const [loading, setLoading] = useState(true);
  const [filteredRestaurants, setFilteredRestaurants] = useState<
    FilteredRestaurant[]
  >([]);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() ?? "";

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data: FilteredRestaurant[] = await delay(1000).then(() =>
          getFilteredRestaurants(),
        );
        if (!searchQuery) {
          setFilteredRestaurants(data);
        } else {
          const filterRestaurants = data.filter(
            (restaurant: FilteredRestaurant) =>
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
    content = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "6rem",
          width: "100vw",
          mt: 4,
        }}
      >
        <Typography
          variant="h6"
          color="gray"
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            textWrap: "nowrap",
          }}
          component="div"
        >
          No Restaurants Found
        </Typography>
        <img
          src="/src/assets/svgs/NotFound.svg"
          alt="No Restaurants Found"
          style={{ width: "100%", height: "auto", maxWidth: "300px" }}
        />
      </Box>
    );
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
