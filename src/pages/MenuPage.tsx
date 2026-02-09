import { Box, Container, Grid2 as Grid, Typography } from "@mui/material";
import RestaurantInfoView from "../features/menu/views/RestaurantInfoView";
import CategoriesBar from "../features/menu/components/CategoriesBar";
import MenuView from "../features/menu/views/MenuView";
import Cart from "../features/menu/components/Cart";
import { Colors } from "../theme";
import { useEffect, useState, useCallback } from "react";
import { getCategories } from "../services/category.service";
import { ICategory } from "../data/Sides";
import { useParams } from "@tanstack/react-router";
import { getSingleRestaurant } from "../services/restaurant.service";
import { Restaurant } from "../types/restaurants";

const MenuPage = () => {
  const { restaurantId } = useParams({
    from: "/restaurants/$restaurantId/menu",
  });
  console.log(restaurantId);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDishesLoading, setIsDishesLoading] = useState(true);

  const handleDishesLoadingChange = useCallback((isLoading: boolean) => {
    setIsDishesLoading(isLoading);
  }, []);

  useEffect(() => {
    const fetchRestaurantAndCategories = async () => {
      if (!restaurantId) {
        setError("No restaurant ID provided in URL.");
        return;
      }

      try {
        const restaurantData = await getSingleRestaurant(restaurantId);
        if (!restaurantData) {
          setError("Restaurant not found.");
          return;
        }
        setRestaurant(restaurantData);
        localStorage.setItem("restaurantName", restaurantData.name);

        const categoryData = await getCategories();
        if (!categoryData) {
          setError("Categories not found.");
        }
        const validCategories = Array.isArray(categoryData) ? categoryData : [];
        setCategories(validCategories);
        setSelectedCategoryId(validCategories[0]?.id || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load restaurant or categories.");
      }
    };

    fetchRestaurantAndCategories();
  }, [restaurantId]);

  if (error) {
    return <Typography>{error}</Typography>;
  }
  return (
    <Box sx={{ flexGrow: 1, width: "100%", mt: 7 }}>
      <RestaurantInfoView restaurant={restaurant} />
      <CategoriesBar
        error={error}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          backgroundColor: Colors.background.default,
          minHeight: "calc(100vh - 130px)",
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid
              size={{
                sm: 12,
                xs: 12,
                md: 8,
              }}
            >
              <MenuView
                categories={categories}
                onDishesLoadingChange={handleDishesLoadingChange}
              />
            </Grid>
            <Grid
              sx={{
                display: {
                  xs: "none",
                  sm: "none",
                  md: "block",
                },
              }}
              size={{
                sm: 0,
                md: 4,
              }}
            >
              {!isDishesLoading && <Cart />}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default MenuPage;
