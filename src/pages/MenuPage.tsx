import {
  Badge,
  Box,
  Container,
  Drawer,
  Fab,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import RestaurantInfoView from "../features/menu/views/RestaurantInfoView";
import CategoriesBar from "../features/menu/components/CategoriesBar";
import MenuView from "../features/menu/views/MenuView";
import Cart from "../features/menu/components/Cart";
import RestaurantMenuSearch from "../features/menu/components/RestaurantMenuSearch";
import { Colors } from "../theme";
import { useEffect, useState, useCallback, useMemo } from "react";
import { ICategory, IDish } from "../data/Sides";
import { useParams } from "react-router-dom";
import { getSingleRestaurant } from "../services/restaurant.service";
import { Restaurant } from "../types/restaurants";
import { useAppSelector } from "../store/hooks/cartHooks";
import { ShoppingCart } from "@mui/icons-material";

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
    isPopular?: boolean | null;
    discountPercent?: number | null;
  }>;
};

type RestaurantWithMenu = Restaurant & {
  categories?: RestaurantCategory[];
};

const SPECIAL_OFFERS_CATEGORY_ID = "special-offers";
const POPULAR_CATEGORY_ID = "popular";

const hasSpecialItems = (categories: ICategory[]) =>
  categories.some((category) =>
    (category.dishes ?? []).some(
      (dish) => Number(dish.discountPercent ?? 0) > 0,
    ),
  );

const hasPopularItems = (categories: ICategory[]) =>
  categories.some((category) =>
    (category.dishes ?? []).some((dish) => dish.isPopular === true),
  );

const getInitialSelectedCategoryId = (categories: ICategory[]) => {
  if (hasSpecialItems(categories)) {
    return SPECIAL_OFFERS_CATEGORY_ID;
  }

  if (hasPopularItems(categories)) {
    return POPULAR_CATEGORY_ID;
  }

  return categories[0]?.id ?? null;
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
        isPopular: dish.isPopular ?? false,
        discountPercent: dish.discountPercent ?? null,
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
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );
  const navigationCategories = useMemo<ICategory[]>(
    () => [
      ...(hasSpecialItems(categories)
        ? [{ id: SPECIAL_OFFERS_CATEGORY_ID, name: "Special offers" }]
        : []),
      ...(hasPopularItems(categories)
        ? [{ id: POPULAR_CATEGORY_ID, name: "Popular now" }]
        : []),
      ...categories,
    ],
    [categories],
  );

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
          "selected-restaurant-minimum-value",
          String(restaurantData.minimumValue),
        );
        if (restaurantData.address?.trim()) {
          localStorage.setItem(
            "selected-restaurant-address",
            restaurantData.address.trim(),
          );
        } else {
          localStorage.removeItem("selected-restaurant-address");
        }

        const validCategories = getMenuCategories(restaurantData);
        setCategories(validCategories);
        setSelectedCategoryId(getInitialSelectedCategoryId(validCategories));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load restaurant or categories.");
      } finally {
        setIsRestaurantLoading(false);
      }
    };

    fetchRestaurantAndCategories();
  }, [orgId]);

  useEffect(() => {
    if (restaurant?.name) {
      document.title = `Deliveroo | ${restaurant.name}`;
    }
  }, [restaurant?.name]);

  if (error) {
    return <Typography>{error}</Typography>;
  }
  return (
    <Box sx={{ flexGrow: 1, width: "100%", mt: 7 }}>
      <RestaurantInfoView
        isLoading={isRestaurantLoading}
        restaurant={restaurant}
      />
      {restaurant && (
        <RestaurantMenuSearch
          categories={categories}
          restaurantName={restaurant.name}
        />
      )}
      <CategoriesBar
        error={error}
        categories={navigationCategories}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        isLoading={isRestaurantLoading}
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
                isLoading={isRestaurantLoading}
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
      <Fab
        aria-label={
          cartItemCount > 0
            ? `Open cart with ${cartItemCount} item${cartItemCount === 1 ? "" : "s"}`
            : "Open empty cart"
        }
        onClick={() => setIsMobileCartOpen(true)}
        sx={{
          position: "fixed",
          right: 18,
          bottom: 24,
          zIndex: 120,
          display: { xs: "flex", md: "none" },
          width: 64,
          height: 64,
          minHeight: 64,
          color: Colors.text.inverse,
          backgroundColor: Colors.background.brand,
          borderRadius: "14px",
          boxShadow: `0px 8px 22px ${Colors.boxShadow.default}`,
          "&:hover": {
            backgroundColor: Colors.background.brandHover,
          },
        }}
      >
        <Badge
          badgeContent={cartItemCount}
          color="error"
          invisible={cartItemCount === 0}
          sx={{
            "& .MuiBadge-badge": {
              fontWeight: 700,
              minWidth: 22,
              height: 22,
              borderRadius: "50%",
              top: 2,
              right: 1,
              color: Colors.text.inverse,
              border: `2px solid ${Colors.background.light}`,
            },
          }}
        >
          <ShoppingCart sx={{ fontSize: 30 }} />
        </Badge>
      </Fab>
      <Drawer
        anchor="bottom"
        open={isMobileCartOpen}
        onClose={() => setIsMobileCartOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            borderRadius: "16px 16px 0 0",
            backgroundColor: Colors.background.light,
            maxHeight: "88vh",
            p: { xs: 1.5, sm: 2 },
          },
        }}
      >
        <Cart layout="drawer" />
      </Drawer>
    </Box>
  );
};

export default MenuPage;
