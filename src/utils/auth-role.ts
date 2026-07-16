import { IUser } from "../types/user.types";

export const isCustomerUser = (user: IUser | null | undefined): boolean =>
  user?.role === "user";

export const getOperationalDashboardPath = (
  user: IUser | null | undefined,
): string | null => {
  if (user?.role === "platform_admin") return "/admin/dashboard";
  if (user?.role === "restaurant_user" && user.restaurantId) {
    return "/restaurant/dashboard";
  }

  return null;
};
