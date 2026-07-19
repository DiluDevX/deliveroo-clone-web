import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks/cartHooks";
import {
  hasRestaurantCapability,
  RestaurantCapability,
} from "../utils/restaurant-permissions";
import { showErrorSnackbar } from "../utils/notifications";

type RestaurantCapabilityProtectedRouteProps = {
  capability: RestaurantCapability;
};

const RestaurantCapabilityProtectedRoute = ({
  capability,
}: RestaurantCapabilityProtectedRouteProps) => {
  const role = useAppSelector((state) => state.auth.user?.restaurantRole);
  const isAllowed = hasRestaurantCapability(role, capability);

  useEffect(() => {
    if (!isAllowed) {
      showErrorSnackbar("Your restaurant role cannot access this page.");
    }
  }, [isAllowed]);

  if (!isAllowed) {
    return <Navigate to="/restaurant/dashboard" replace />;
  }

  return <Outlet />;
};

export default RestaurantCapabilityProtectedRoute;
