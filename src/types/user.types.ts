import type { z } from "zod";
import type { RestaurantUserRoleSchema } from "./dto/model.schemas";

export type RestaurantUserRole = z.infer<typeof RestaurantUserRoleSchema>;

export type IUser = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role?: string;
  restaurantId?: string;
  restaurantRole?: RestaurantUserRole;
  orderCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
  isDefault: boolean;
}
