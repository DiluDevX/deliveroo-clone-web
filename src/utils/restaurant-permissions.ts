import type { RestaurantUserRole } from "../types/user.types";

export type RestaurantCapability =
  | "view_dashboard"
  | "manage_orders"
  | "manage_menu"
  | "view_analytics"
  | "manage_settings"
  | "manage_team";

const RESTAURANT_ROLE_CAPABILITIES = {
  employee: ["view_dashboard", "manage_orders"],
  finance: ["view_dashboard", "view_analytics"],
  admin: [
    "view_dashboard",
    "manage_orders",
    "manage_menu",
    "view_analytics",
    "manage_settings",
    "manage_team",
  ],
  super_admin: [
    "view_dashboard",
    "manage_orders",
    "manage_menu",
    "view_analytics",
    "manage_settings",
    "manage_team",
  ],
} satisfies Record<RestaurantUserRole, readonly RestaurantCapability[]>;

export const isRestaurantUserRole = (
  role: unknown,
): role is RestaurantUserRole =>
  typeof role === "string" && role in RESTAURANT_ROLE_CAPABILITIES;

export const hasRestaurantCapability = (
  role: RestaurantUserRole | undefined,
  capability: RestaurantCapability,
): boolean => {
  if (!role) return false;

  const capabilities: readonly RestaurantCapability[] =
    RESTAURANT_ROLE_CAPABILITIES[role];
  return capabilities.includes(capability);
};
