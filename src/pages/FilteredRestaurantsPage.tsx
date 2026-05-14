import {
  Box,
  Grid2 as Grid,
  useMediaQuery,
  useTheme,
  Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";

import RestaurantView from "../features/menu/components/RestaurantView";
import LoadingIndicator from "../features/menu/components/LoadingIndicator";
import Button from "../features/menu/components/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterPanel from "../features/menu/components/FilterPanel";
import FilterChips from "../features/menu/components/FilterChips";
import SearchBar from "../features/menu/components/SearchBar";
import { Colors } from "../theme/colors";
import {
  getFilteredRestaurants,
  RestaurantFilters,
  PaginatedResponse,
} from "../services/restaurant.service";
import { Restaurant } from "../types/restaurants";
import { MINIMUM_ORDER_VALUE_THRESHOLDS, FilterState } from "../types/filters";
import NotFoundScreen from "../features/menu/components/NotFoundScreen";

const FilteredRestaurantsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [restaurantsData, setRestaurantsData] = useState<Restaurant[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() ?? "";
  const rawPageFromUrl = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const pageFromUrl =
    Number.isFinite(rawPageFromUrl) && rawPageFromUrl > 0 ? rawPageFromUrl : 1;
  const [searchKey, setSearchKey] = useState(searchQuery);
  const [filters, setFilters] = useState<FilterState>({
    cuisines: [],
    priceRange: "all",
    minRating: null,
    deliveryTime: null,
    offers: false,
  });

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const filterParams: RestaurantFilters = {
          page: pageFromUrl,
          limit: ITEMS_PER_PAGE,
        };

        if (searchQuery) {
          filterParams.search = searchQuery;
        }
        if (filters.cuisines.length > 0) {
          filterParams.cuisine = filters.cuisines[0];
        }
        if (filters.minRating) {
          filterParams.rating = filters.minRating;
        }
        if (filters.priceRange === "budget") {
          filterParams.maxOrderValue = MINIMUM_ORDER_VALUE_THRESHOLDS.budgetMax;
        } else if (filters.priceRange === "mid") {
          filterParams.minOrderValue = MINIMUM_ORDER_VALUE_THRESHOLDS.midMin;
          filterParams.maxOrderValue = MINIMUM_ORDER_VALUE_THRESHOLDS.midMax;
        } else if (filters.priceRange === "premium") {
          filterParams.minOrderValue = MINIMUM_ORDER_VALUE_THRESHOLDS.premiumMin;
        }
        if (filters.offers) {
          filterParams.tags = "popular";
        }
        filterParams.status = "ACTIVE";
        filterParams.isOpen = true;

        const response: PaginatedResponse =
          await getFilteredRestaurants(filterParams);
        setRestaurantsData(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching restaurants", error);
        setRestaurantsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [
    searchQuery,
    pageFromUrl,
    filters.cuisines,
    filters.minRating,
    filters.offers,
    filters.priceRange,
  ]);

  useEffect(() => {
    setSearchKey(searchQuery);
  }, [searchQuery]);

  const filteredRestaurants = restaurantsData;

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
    content = (
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ width: "100%" }}
      >
        {filteredRestaurants.map((restaurant) => (
          <Grid key={restaurant.id} size={{ xs: 12, sm: 6, md: 6 }}>
            <RestaurantView restaurant={restaurant} />
          </Grid>
        ))}
      </Grid>
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
          pt: { xs: "80px", md: "100px" },
          pb: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            mb: 3,
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="border"
            PrefixComponent={<ArrowBackIcon sx={{ height: "1.3rem" }} />}
            onClick={() => navigate("/")}
            sx={{
              border: "none",
              color: Colors.background.brand,
              fontSize: "0.9rem",
              fontWeight: "normal",
              textTransform: "none",
            }}
          >
            Back
          </Button>

          <SearchBar
            value={searchKey}
            onChange={setSearchKey}
            onSearch={(value) =>
              navigate(
                `/filtered-restaurants?search=${encodeURIComponent(value)}`,
              )
            }
            placeholder="Search restaurants..."
          />

          <Button
            variant="outlined"
            PrefixComponent={<FilterListIcon />}
            onClick={() => {
              if (isMobile) {
                setIsFilterOpen(true);
              } else {
                setShowSidebar(!showSidebar);
              }
            }}
            sx={{
              color: Colors.background.brand,
              textTransform: "none",
              fontSize: "0.9rem",
            }}
          >
            {isMobile
              ? "Filters"
              : showSidebar
                ? "Hide Filters"
                : "Show Filters"}
          </Button>
        </Box>

        {/* Filter Chips */}
        {(filters.cuisines.length > 0 ||
          filters.priceRange !== "all" ||
          filters.minRating != null ||
          filters.deliveryTime != null ||
          filters.offers) && (
          <Box sx={{ mb: 3 }}>
            <FilterChips filters={filters} onFilterChange={setFilters} />
          </Box>
        )}

        {/* Content */}
        {content}

        {/* Pagination */}
        {filteredRestaurants.length > 0 && totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
              mb: 2,
            }}
          >
            <Pagination
              count={totalPages}
              page={pageFromUrl}
              onChange={(_, page) => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                const nextParams = new URLSearchParams(searchParams);
                nextParams.set("page", page.toString());

                if (searchQuery) {
                  nextParams.set("search", searchQuery);
                } else {
                  nextParams.delete("search");
                }

                setSearchParams(nextParams);
              }}
              sx={{
                "& .MuiButtonBase-root": {
                  color: Colors.background.brand,
                  "&.Mui-selected": {
                    backgroundColor: `${Colors.background.brand} !important`,
                    color: `${Colors.text.inverse} !important`,
                  },
                },
              }}
            />
          </Box>
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

export default FilteredRestaurantsPage;
