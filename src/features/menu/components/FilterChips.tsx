import { Box, Chip, Button } from "@mui/material";
import { Colors } from "../../../theme/colors";
import {
  FilterState,
  CUISINE_OPTIONS,
  PRICE_OPTIONS,
  RATING_OPTIONS,
  DELIVERY_TIME_OPTIONS,
} from "../../../types/filters";

interface FilterChipsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FilterChips = ({ filters, onFilterChange }: FilterChipsProps) => {
  const hasActiveFilters =
    filters.cuisines.length > 0 ||
    filters.priceRange !== "all" ||
    filters.minRating !== null ||
    filters.deliveryTime !== null ||
    filters.offers;

  const handleRemoveFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case "cuisine":
        onFilterChange({
          ...filters,
          cuisines: filters.cuisines.filter((c) => c !== value),
        });
        break;
      case "price":
        onFilterChange({ ...filters, priceRange: "all" });
        break;
      case "rating":
        onFilterChange({ ...filters, minRating: null });
        break;
      case "deliveryTime":
        onFilterChange({ ...filters, deliveryTime: null });
        break;
      case "offers":
        onFilterChange({ ...filters, offers: false });
        break;
    }
  };

  const handleClearAll = () => {
    onFilterChange({
      cuisines: [],
      priceRange: "all",
      minRating: null,
      deliveryTime: null,
      offers: false,
      searchQuery: filters.searchQuery,
    });
  };

  const getCuisineLabel = (id: string) => {
    return CUISINE_OPTIONS.find((c) => c.id === id)?.label || id;
  };

  const getPriceLabel = (price: string) => {
    return PRICE_OPTIONS.find((p) => p.value === price)?.label || price;
  };

  const getRatingLabel = (rating: number) => {
    return RATING_OPTIONS.find((r) => r.value === rating)?.label || rating;
  };

  const getDeliveryTimeLabel = (time: number) => {
    return DELIVERY_TIME_OPTIONS.find((d) => d.value === time)?.label || time;
  };

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Cuisine Chips */}
        {filters.cuisines.map((cuisine) => (
          <Chip
            key={cuisine}
            label={getCuisineLabel(cuisine)}
            onDelete={() => handleRemoveFilter("cuisine", cuisine)}
            sx={{
              backgroundColor: "rgba(0, 204, 188, 0.1)",
              color: Colors.background.brand,
              fontSize: "0.85rem",
              fontWeight: 500,
              "& .MuiChip-deleteIcon": {
                color: Colors.background.brand,
                fontSize: "1rem",
              },
              "&:hover": {
                backgroundColor: "rgba(0, 204, 188, 0.2)",
              },
            }}
          />
        ))}

        {/* Price Chip */}
        {filters.priceRange !== "all" && (
          <Chip
            label={getPriceLabel(filters.priceRange)}
            onDelete={() => handleRemoveFilter("price")}
            sx={{
              backgroundColor: "rgba(0, 204, 188, 0.1)",
              color: Colors.background.brand,
              fontSize: "0.85rem",
              fontWeight: 500,
              "& .MuiChip-deleteIcon": {
                color: Colors.background.brand,
                fontSize: "1rem",
              },
              "&:hover": {
                backgroundColor: "rgba(0, 204, 188, 0.2)",
              },
            }}
          />
        )}

        {/* Rating Chip */}
        {filters.minRating != null && (
          <Chip
            label={getRatingLabel(filters.minRating)}
            onDelete={() => handleRemoveFilter("rating")}
            sx={{
              backgroundColor: "rgba(0, 204, 188, 0.1)",
              color: Colors.background.brand,
              fontSize: "0.85rem",
              fontWeight: 500,
              "& .MuiChip-deleteIcon": {
                color: Colors.background.brand,
                fontSize: "1rem",
              },
              "&:hover": {
                backgroundColor: "rgba(0, 204, 188, 0.2)",
              },
            }}
          />
        )}

        {/* Delivery Time Chip */}
        {filters.deliveryTime != null && (
          <Chip
            label={getDeliveryTimeLabel(filters.deliveryTime)}
            onDelete={() => handleRemoveFilter("deliveryTime")}
            sx={{
              backgroundColor: "rgba(0, 204, 188, 0.1)",
              color: Colors.background.brand,
              fontSize: "0.85rem",
              fontWeight: 500,
              "& .MuiChip-deleteIcon": {
                color: Colors.background.brand,
                fontSize: "1rem",
              },
              "&:hover": {
                backgroundColor: "rgba(0, 204, 188, 0.2)",
              },
            }}
          />
        )}

        {/* Offers Chip */}
        {filters.offers && (
          <Chip
            label="Offers Only"
            onDelete={() => handleRemoveFilter("offers")}
            sx={{
              backgroundColor: "rgba(0, 204, 188, 0.1)",
              color: Colors.background.brand,
              fontSize: "0.85rem",
              fontWeight: 500,
              "& .MuiChip-deleteIcon": {
                color: Colors.background.brand,
                fontSize: "1rem",
              },
              "&:hover": {
                backgroundColor: "rgba(0, 204, 188, 0.2)",
              },
            }}
          />
        )}

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Button
            onClick={handleClearAll}
            sx={{
              textTransform: "none",
              color: Colors.background.brand,
              fontSize: "0.85rem",
              fontWeight: 500,
              ml: 1,
              padding: 0,
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            Clear all
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default FilterChips;
