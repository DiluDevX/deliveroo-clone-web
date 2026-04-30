import axios from "axios";
import { GetASingleRestaurant, Restaurant } from "../types/restaurants";
import { DUMMY_RESTAURANTS } from "../data/dummyRestaurants";

export interface RestaurantFilters {
  search?: string;
  cuisine?: string;
  status?: string;
  tags?: string;
  rating?: number;
  minDeliveryFee?: number;
  maxDeliveryFee?: number;
  minOrderValue?: number;
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

export const getAllRestaurants = async (
  filters?: RestaurantFilters,
): Promise<Restaurant[]> => {
  try {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.cuisine) params.append("cuisine", filters.cuisine);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sort) params.append("sort", filters.sort);

    const queryString = params.toString();
    const url = queryString
      ? `/api/restaurants?${queryString}`
      : "/api/restaurants";

    const response = await axios.get(url);
    if (!response.data) {
      throw new Error("Failed to fetch all Restaurants.");
    }
    const data = await response.data;
    return data.data;
  } catch (error) {
    console.error("Error fetching all Restaurants.", error);
    console.log("Using dummy restaurant data for development");

    let filtered = [...DUMMY_RESTAURANTS];

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.tags.some((t) => t.toLowerCase().includes(searchLower)) ||
          r.description.toLowerCase().includes(searchLower),
      );
    }

    if (filters?.cuisine) {
      filtered = filtered.filter((r) =>
        r.tags.some((t) => t.toLowerCase() === filters.cuisine?.toLowerCase()),
      );
    }

    return filtered;
  }
};

export const getFilteredRestaurants = async (
  filters?: RestaurantFilters,
): Promise<PaginatedResponse> => {
  try {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.cuisine) params.append("cuisine", filters.cuisine);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sort) params.append("sort", filters.sort);

    const queryString = params.toString();
    const url = queryString
      ? `/api/restaurants?${queryString}`
      : "/api/restaurants/";

    const response = await axios.get<ApiPaginatedResponse>(url);
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
    console.log("Using dummy restaurant data for development");

    let filtered = [...DUMMY_RESTAURANTS];

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.tags.some((t) => t.toLowerCase().includes(searchLower)) ||
          r.description.toLowerCase().includes(searchLower),
      );
    }

    if (filters?.cuisine) {
      filtered = filtered.filter((r) =>
        r.tags.some((t) => t.toLowerCase() === filters.cuisine?.toLowerCase()),
      );
    }

    if (filters?.tags === "popular") {
      filtered = filtered.slice(0, 5);
    }

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
    const response = await axios.get(
      `/api/restaurants/${encodeURIComponent(restaurantId)}`,
    );

    if (!response.data) {
      throw new Error("Restaurant not found");
    }
    const data: GetASingleRestaurant = await response.data;
    return data.data;
  } catch (error) {
    console.error("Error fetching Restaurant", error);
    return null;
  }
};
