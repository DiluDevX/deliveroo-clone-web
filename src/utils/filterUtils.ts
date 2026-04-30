import { Restaurant } from "../types/restaurants";
import { FilterState } from "../types/filters";

const matchesCuisine = (
  restaurant: Restaurant,
  filters: FilterState,
): boolean => {
  if (filters.cuisines.length === 0) return true;
  return filters.cuisines.some((cuisine) =>
    restaurant.tags.some((tag) => tag.toLowerCase() === cuisine.toLowerCase()),
  );
};

const matchesPrice = (
  restaurant: Restaurant,
  filters: FilterState,
): boolean => {
  if (filters.priceRange === "all") return true;

  const minimumValue = Number.parseInt(restaurant.minimumValue, 10);

  switch (filters.priceRange) {
    case "budget":
      return minimumValue <= 15;
    case "mid":
      return minimumValue > 15 && minimumValue <= 30;
    case "premium":
      return minimumValue > 30;
    default:
      return true;
  }
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
      matchesPrice(restaurant, filters)
    );
  });
};
