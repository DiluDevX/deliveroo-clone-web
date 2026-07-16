import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../store/hooks/cartHooks";
import { showErrorSnackbar } from "../utils/notifications";

const RestaurantAdminProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const hasRestaurantAccess =
    user?.role === "restaurant_user" && Boolean(user.restaurantId);
  const shouldRedirect = !isAuthenticated || !hasRestaurantAccess;

  useEffect(() => {
    if (shouldRedirect) {
      showErrorSnackbar(
        isAuthenticated
          ? "No restaurant assigned to this account. Please contact support."
          : "Please log in to access the restaurant dashboard.",
      );
    }
  }, [isAuthenticated, shouldRedirect]);

  if (shouldRedirect) {
    return <Navigate to="/account/login" replace />;
  }

  return <Outlet />;
};

export default RestaurantAdminProtectedRoute;
