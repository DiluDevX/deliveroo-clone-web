import { Restaurant } from "../types/restaurants";
import { FilterState } from "../types/filters";

const BUDGET_MAXIMUM_ORDER_VALUE = 15;
const MID_RANGE_MAXIMUM_ORDER_VALUE = 30;

const normalizeCuisineValue = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, " ");

const matchesCuisine = (
  restaurant: Restaurant,
  filters: FilterState,
): boolean => {
  if (filters.cuisines.length === 0) return true;
  return filters.cuisines.some((cuisine) =>
    restaurant.tags.some(
      (tag) => normalizeCuisineValue(tag) === normalizeCuisineValue(cuisine),
    ),
  );
};

const matchesPrice = (
  restaurant: Restaurant,
  filters: FilterState,
): boolean => {
  if (filters.priceRange === "all") return true;

  const minimumValue = Number.parseInt(restaurant.minimumValue, 10);
  if (!Number.isFinite(minimumValue)) return false;

  switch (filters.priceRange) {
    case "budget":
      return minimumValue <= BUDGET_MAXIMUM_ORDER_VALUE;
    case "mid":
      return (
        minimumValue > BUDGET_MAXIMUM_ORDER_VALUE &&
        minimumValue <= MID_RANGE_MAXIMUM_ORDER_VALUE
      );
    case "premium":
      return minimumValue > MID_RANGE_MAXIMUM_ORDER_VALUE;
    default:
      return true;
  }
};

const matchesRating = (
  restaurant: Restaurant,
  filters: FilterState,
): boolean => {
  if (filters.minRating === null) return true;
  return (restaurant.rating ?? 0) >= filters.minRating;
};

const matchesSearch = (
  restaurant: Restaurant,
  filters: FilterState,
): boolean => {
  if (!filters.searchQuery) return true;
  return restaurant.name
    .toLowerCase()
    .includes(filters.searchQuery.toLowerCase());
};

export const filterRestaurants = (
  restaurants: Restaurant[],
  filters: FilterState,
): Restaurant[] => {
  return restaurants.filter((restaurant) => {
    return (
      matchesSearch(restaurant, filters) &&
      matchesCuisine(restaurant, filters) &&
      matchesPrice(restaurant, filters) &&
      matchesRating(restaurant, filters)
    );
  });
};
