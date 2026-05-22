import { Box, Container, Grid2 as Grid, Typography } from "@mui/material";
import RestaurantInfoView from "../features/menu/views/RestaurantInfoView";
import CategoriesBar from "../features/menu/components/CategoriesBar";
import MenuView from "../features/menu/views/MenuView";
import Cart from "../features/menu/components/Cart";
import { Colors } from "../theme";
import { useEffect, useState, useCallback } from "react";
import { ICategory, IDish } from "../data/Sides";
import { useParams } from "react-router-dom";
import { getSingleRestaurant } from "../services/restaurant.service";
import { Restaurant } from "../types/restaurants";

type RestaurantCategory = {
  id: string;
  name: string;
  dishes?: Array<{
    id: string;
    name: string;
    description?: string | null;
    price: number;
    image?: string | null;
    categoryId?: string;
  }>;
};

type RestaurantWithMenu = Restaurant & {
  categories?: RestaurantCategory[];
};

const mapRestaurantCategories = (
  restaurantData: RestaurantWithMenu,
): ICategory[] =>
  (restaurantData.categories ?? []).map((category) => ({
    id: category.id,
    name: category.name,
    dishes: (category.dishes ?? []).map(
      (dish): IDish => ({
        _id: dish.id,
        id: dish.id,
        name: dish.name,
        description: dish.description ?? "",
        price: String(dish.price),
        image: dish.image ?? "",
        categoryId: category.id,
      }),
    ),
  }));

const getMenuCategories = (restaurantData: RestaurantWithMenu) => {
  const restaurantCategories = mapRestaurantCategories(restaurantData);
  const hasRealDishes = restaurantCategories.some(
    (category) => (category.dishes ?? []).length > 0,
  );

  return hasRealDishes ? restaurantCategories : [];
};

const MenuPage = () => {
  const { orgId } = useParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRestaurantLoading, setIsRestaurantLoading] = useState(true);
  const [isDishesLoading, setIsDishesLoading] = useState(true);

  const handleDishesLoadingChange = useCallback((isLoading: boolean) => {
    setIsDishesLoading(isLoading);
  }, []);

  useEffect(() => {
    const fetchRestaurantAndCategories = async () => {
      if (!orgId) {
        setError("No restaurant ID provided in URL.");
        setIsRestaurantLoading(false);
        return;
      }

      setIsRestaurantLoading(true);
      try {
        const restaurantData = await getSingleRestaurant(orgId);
        if (!restaurantData) {
          setError("Restaurant not found.");
          return;
        }
        setRestaurant(restaurantData);
        localStorage.setItem("id", restaurantData.id);
        localStorage.setItem("restaurantName", restaurantData.name);
        localStorage.setItem("selected-restaurant-id", restaurantData.id);
        localStorage.setItem("selected-restaurant-name", restaurantData.name);
        localStorage.setItem(
          "selected-restaurant-address",
          restaurantData.description || "",
        );

        const validCategories = getMenuCategories(restaurantData);
        setCategories(validCategories);
        setSelectedCategoryId(validCategories[0]?.id || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load restaurant or categories.");
      } finally {
        setIsRestaurantLoading(false);
      }
    };

    fetchRestaurantAndCategories();
  }, [orgId]);

  if (error) {
    return <Typography>{error}</Typography>;
  }
  return (
    <Box sx={{ flexGrow: 1, width: "100%", mt: 7 }}>
      <RestaurantInfoView
        isLoading={isRestaurantLoading}
        restaurant={restaurant}
      />
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
