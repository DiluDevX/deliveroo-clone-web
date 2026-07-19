import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../store/hooks/cartHooks";
import { showErrorSnackbar } from "../utils/notifications";
import { isRestaurantUserRole } from "../utils/restaurant-permissions";

const RestaurantAdminProtectedRoute = () => {
  const isAuthInitialized = useAppSelector(
    (state) => state.auth.isAuthInitialized,
  );
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const hasRestaurantAccess =
    user?.role === "restaurant_user" &&
    Boolean(user.restaurantId) &&
    isRestaurantUserRole(user.restaurantRole);
  const shouldRedirect =
    isAuthInitialized && (!isAuthenticated || !hasRestaurantAccess);

  useEffect(() => {
    if (isAuthInitialized && shouldRedirect) {
      showErrorSnackbar(
        isAuthenticated
          ? "No restaurant assigned to this account. Please contact support."
          : "Please log in to access the restaurant dashboard.",
      );
    }
  }, [isAuthenticated, isAuthInitialized, shouldRedirect]);

  if (!isAuthInitialized) {
    return null;
  }

  if (shouldRedirect) {
    return <Navigate to="/account/login" replace />;
  }

  return <Outlet />;
};

export default RestaurantAdminProtectedRoute;
