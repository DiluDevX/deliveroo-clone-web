import { apiClient } from "./api.client";
import { GetASingleRestaurant, Restaurant } from "../types/restaurants";
import { DUMMY_RESTAURANTS } from "../data/dummyRestaurants";
import { filterRestaurants, normalizeCuisineValue } from "../utils/filterUtils";
import { FilterState } from "../types/filters";

export interface RestaurantFilters {
  search?: string;
  cuisine?: string;
  status?: string;
  tags?: string;
  rating?: number;
  minDeliveryFee?: number;
  maxDeliveryFee?: number;
  minOrderValue?: number;
  maxOrderValue?: number;
  isOpen?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginatedResponse {
  data: Restaurant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiPaginatedResponse {
  success: boolean;
  message: string;
  data: Restaurant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const appendRestaurantFilters = (
  params: URLSearchParams,
  filters?: RestaurantFilters,
) => {
  if (!filters) return;

  if (filters.search) params.append("search", filters.search);
  if (filters.cuisine) params.append("cuisine", filters.cuisine);
  if (filters.status) params.append("status", filters.status);
  if (filters.tags) params.append("tags", filters.tags);
  if (filters.rating !== undefined) {
    params.append("rating", filters.rating.toString());
  }
  if (filters.minDeliveryFee !== undefined) {
    params.append("minDeliveryFee", filters.minDeliveryFee.toString());
  }
  if (filters.maxDeliveryFee !== undefined) {
    params.append("maxDeliveryFee", filters.maxDeliveryFee.toString());
  }
  if (filters.minOrderValue !== undefined) {
    params.append("minOrderValue", filters.minOrderValue.toString());
  }
  if (filters.maxOrderValue !== undefined) {
    params.append("maxOrderValue", filters.maxOrderValue.toString());
  }
  if (filters.isOpen !== undefined) {
    params.append("isOpen", filters.isOpen.toString());
  }
  if (filters.page !== undefined)
    params.append("page", filters.page.toString());
  if (filters.limit !== undefined) {
    params.append("limit", filters.limit.toString());
  }
  if (filters.sort) params.append("sort", filters.sort);
};

const parseMoneyValue = (value: number | string) => {
  const parsedValue = Number.parseFloat(String(value));
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const parseTimeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  if (
    hours === undefined ||
    minutes === undefined ||
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes)
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

const isRestaurantOpen = (restaurant: Restaurant) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openingMinutes = parseTimeToMinutes(restaurant.openingAt);
  const closingMinutes = parseTimeToMinutes(restaurant.closingAt);

  if (openingMinutes === null || closingMinutes === null) {
    return false;
  }

  if (openingMinutes <= closingMinutes) {
    return currentMinutes >= openingMinutes && currentMinutes <= closingMinutes;
  }

  return currentMinutes >= openingMinutes || currentMinutes <= closingMinutes;
};

const toFallbackFilterState = (filters?: RestaurantFilters): FilterState => {
  let priceRange: FilterState["priceRange"] = "all";

  if (
    filters?.minOrderValue !== undefined &&
    filters.maxOrderValue !== undefined
  ) {
    priceRange = "mid";
  } else if (filters?.maxOrderValue !== undefined) {
    priceRange = "budget";
  } else if (filters?.minOrderValue !== undefined) {
    priceRange = "premium";
  }

  return {
    cuisines: filters?.cuisine ? [filters.cuisine] : [],
    priceRange,
    minRating: filters?.rating ?? null,
    deliveryTime: null,
    offers: false,
    searchQuery: filters?.search,
  };
};

const applyFallbackFilters = (
  restaurants: Restaurant[],
  filters?: RestaurantFilters,
) => {
  let filtered = filterRestaurants(restaurants, toFallbackFilterState(filters));

  if (filters?.minDeliveryFee !== undefined) {
    const minimumDeliveryFee = filters.minDeliveryFee;
    filtered = filtered.filter((restaurant) => {
      const deliveryCharge = parseMoneyValue(restaurant.deliveryCharge);
      return deliveryCharge !== null && deliveryCharge >= minimumDeliveryFee;
    });
  }

  if (filters?.maxDeliveryFee !== undefined) {
    const maximumDeliveryFee = filters.maxDeliveryFee;
    filtered = filtered.filter((restaurant) => {
      const deliveryCharge = parseMoneyValue(restaurant.deliveryCharge);
      return deliveryCharge !== null && deliveryCharge <= maximumDeliveryFee;
    });
  }

  if (filters?.minOrderValue !== undefined) {
    const minimumOrderValue = filters.minOrderValue;
    filtered = filtered.filter((restaurant) => {
      const minimumValue = parseMoneyValue(restaurant.minimumValue);
      return minimumValue !== null && minimumValue >= minimumOrderValue;
    });
  }

  if (filters?.maxOrderValue !== undefined) {
    const maximumOrderValue = filters.maxOrderValue;
    filtered = filtered.filter((restaurant) => {
      const minimumValue = parseMoneyValue(restaurant.minimumValue);
      return minimumValue !== null && minimumValue <= maximumOrderValue;
    });
  }

  if (filters?.tags) {
    const selectedTags = filters.tags.split(",").map(normalizeCuisineValue);
    if (selectedTags.includes("popular")) {
      filtered = filtered.slice(0, 5);
    } else {
      filtered = filtered.filter((restaurant) =>
        restaurant.tags.some((tag) =>
          selectedTags.includes(normalizeCuisineValue(tag)),
        ),
      );
    }
  }

  if (filters?.isOpen !== undefined) {
    filtered = filtered.filter((restaurant) => isRestaurantOpen(restaurant));
  }

  return filtered;
};

export const getAllRestaurants = async (
  filters?: RestaurantFilters,
): Promise<Restaurant[]> => {
  try {
    const params = new URLSearchParams();
    appendRestaurantFilters(params, filters);

    const queryString = params.toString();
    const url = queryString
      ? `/restaurants?${queryString}`
      : "/restaurants";

    const response = await apiClient.get(url);
    if (!response.data) {
      throw new Error("Failed to fetch all Restaurants.");
    }
    const data = await response.data;
    return data.data;
  } catch (error) {
    console.error("Error fetching all Restaurants.", error);

    if (!import.meta.env.DEV) {
      return [];
    }

    console.log("Using dummy restaurant data for development");
    return applyFallbackFilters(DUMMY_RESTAURANTS, filters);
  }
};

export const getFilteredRestaurants = async (
  filters?: RestaurantFilters,
): Promise<PaginatedResponse> => {
  try {
    const params = new URLSearchParams();
    appendRestaurantFilters(params, filters);

    const queryString = params.toString();
    const url = queryString
      ? `/restaurants?${queryString}`
      : "/restaurants";

    const response = await apiClient.get<ApiPaginatedResponse>(url);
    if (!response.data) {
      throw new Error("Failed to fetch filtered Restaurants.");
    }

    // Transform API response to our format
    const apiData = response.data;
    return {
      data: apiData.data,
      total: apiData.pagination.total,
      page: apiData.pagination.page,
      limit: apiData.pagination.limit,
      totalPages: apiData.pagination.totalPages,
    };
  } catch (error) {
    console.error("Error fetching filtered Restaurants:", error);

    if (!import.meta.env.DEV) {
      return {
        data: [],
        total: 0,
        page: filters?.page ?? 1,
        limit: filters?.limit ?? 10,
        totalPages: 0,
      };
    }

    console.log("Using dummy restaurant data for development");
    const filtered = applyFallbackFilters(DUMMY_RESTAURANTS, filters);

    // Pagination
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const start = (page - 1) * limit;
    const paginatedData = filtered.slice(start, start + limit);
    const totalPages = Math.ceil(filtered.length / limit);

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      limit,
      totalPages,
    };
  }
};
export const getSingleRestaurant = async (restaurantId: string) => {
  try {
    const response = await apiClient.get<GetASingleRestaurant>(
      `/restaurants/${encodeURIComponent(restaurantId)}`,
    );
    return response.data.data;
  } catch {
    return null;
  }
};
