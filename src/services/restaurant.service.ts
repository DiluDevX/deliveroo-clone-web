import { apiClient } from "./api.client";
import { GetASingleRestaurant, Restaurant } from "../types/restaurants";
import { getAuthHeader } from "./auth-headers";

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

export const getAllRestaurants = async (
  filters?: RestaurantFilters,
): Promise<Restaurant[]> => {
  try {
    const params = new URLSearchParams();
    appendRestaurantFilters(params, filters);

    const queryString = params.toString();
    const url = queryString ? `/restaurants?${queryString}` : "/restaurants";

    const response = await apiClient.get(url, { headers: getAuthHeader() });
    if (!response.data) {
      throw new Error("Failed to fetch all Restaurants.");
    }
    const data = await response.data;
    return data.data;
  } catch (error) {
    console.error("Error fetching all Restaurants.", error);
    return [];
  }
};

export const getFilteredRestaurants = async (
  filters?: RestaurantFilters,
): Promise<PaginatedResponse> => {
  try {
    const params = new URLSearchParams();
    appendRestaurantFilters(params, filters);

    const queryString = params.toString();
    const url = queryString ? `/restaurants?${queryString}` : "/restaurants";

    const response = await apiClient.get<ApiPaginatedResponse>(url, {
      headers: getAuthHeader(),
    });
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

    return {
      data: [],
      total: 0,
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 10,
      totalPages: 0,
    };
  }
};
export const getSingleRestaurant = async (restaurantId: string) => {
  try {
    const response = await apiClient.get<GetASingleRestaurant>(
      `/restaurants/${encodeURIComponent(restaurantId)}`,
      { headers: getAuthHeader() },
    );
    return response.data.data;
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error("Error fetching Restaurant", error);
    }
    return null;
  }
};

export const createRestaurant = async (
  restaurant: Partial<Restaurant>,
): Promise<Restaurant | null> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      data: Restaurant;
    }>("/restaurants", restaurant, { headers: getAuthHeader() });

    if (!response.data.data) {
      if (!import.meta.env.PROD) {
        console.error("Create Restaurant returned an empty response");
      }
      return null;
    }

    return response.data.data;
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error("Error creating Restaurant", error);
    }
    return null;
  }
};
