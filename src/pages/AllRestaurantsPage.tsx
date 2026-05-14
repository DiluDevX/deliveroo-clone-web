import {
  Box,
  Grid2 as Grid,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";

import RestaurantView from "../features/menu/components/RestaurantView";
import LoadingIndicator from "../features/menu/components/LoadingIndicator";
import FilterPanel from "../features/menu/components/FilterPanel";
import FilterChips from "../features/menu/components/FilterChips";
import {
  getAllRestaurants,
  RestaurantFilters,
} from "../services/restaurant.service";
import { Restaurant } from "../types/restaurants";
import { FilterState } from "../types/filters";
import { Colors } from "../theme/colors";

const AllRestaurantsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [restaurant, setRestaurant] = useState<Restaurant[]>([]);
  const [error, setError] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    cuisines: [],
    priceRange: "all",
    minRating: null,
    deliveryTime: null,
    offers: false,
    searchQuery: "",
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const filterParams: RestaurantFilters = {};

        if (filters.searchQuery) {
          filterParams.search = filters.searchQuery;
        }
        if (filters.cuisines.length > 0) {
          filterParams.cuisine = filters.cuisines[0];
        }
        if (filters.minRating) {
          filterParams.rating = filters.minRating;
        }
        if (filters.offers) {
          filterParams.tags = "popular";
        }
        filterParams.status = "ACTIVE";
        filterParams.isOpen = true;

        const data = await getAllRestaurants(filterParams);
        if (data && data.length > 0) {
          setError("");
          setRestaurant(data);
        } else {
          setRestaurant([]);
          setError("Restaurant not found.");
        }
      } catch (error) {
        console.error("Error fetching Restaurant", error);
      }
    };

    fetchRestaurants();
  }, [filters]);

  const filteredRestaurants = restaurant;

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
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
      }}
    >
      {/* Filter Panel - Desktop Sidebar */}
      {!isMobile && showSidebar && (
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          isOpen={true}
        />
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          px: { xs: 2, sm: 4, md: 5 },
          pt: "100px",
        }}
      >
        {/* Filter Button - All Screens */}
        <Box sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => {
              if (isMobile) {
                setIsFilterOpen(true);
              } else {
                setShowSidebar(!showSidebar);
              }
            }}
            sx={{
              borderColor: Colors.background.brand,
              color: Colors.background.brand,
              textTransform: "none",
              fontSize: "0.9rem",
              "&:hover": {
                borderColor: Colors.background.brandHover,
                backgroundColor: "rgba(0, 204, 188, 0.05)",
              },
            }}
          >
            {isMobile
              ? "Filters"
              : showSidebar
                ? "Hide Filters"
                : "Show Filters"}
          </Button>
          <Box sx={{ fontSize: "0.85rem", color: Colors.text.placeholder }}>
            {filteredRestaurants.length} results
          </Box>
        </Box>

        {/* Filter Chips */}
        {(filters.cuisines.length > 0 ||
          filters.priceRange !== "all" ||
          filters.minRating !== null ||
          filters.deliveryTime !== null ||
          filters.offers) && (
          <Box sx={{ mb: 3 }}>
            <FilterChips filters={filters} onFilterChange={setFilters} />
          </Box>
        )}

        {/* Restaurants Grid */}
        {filteredRestaurants.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <LoadingIndicator />
          </Box>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {filteredRestaurants.map((restaurant) => (
              <Grid size={{ xs: 12, sm: 6, md: 6 }} key={restaurant.id}>
                <RestaurantView restaurant={restaurant} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Mobile Filter Drawer */}
      {isMobile && (
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          onClose={() => setIsFilterOpen(false)}
          isOpen={isFilterOpen}
        />
      )}
    </Box>
  );
};

export default AllRestaurantsPage;
