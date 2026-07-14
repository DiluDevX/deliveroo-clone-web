import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks/cartHooks";
import { showErrorSnackbar } from "../utils/notifications";

const RestaurantAdminProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const hasRestaurantAccess = user?.role === "restaurant_user";

  if (!isAuthenticated || !hasRestaurantAccess) {
    showErrorSnackbar(
      "No restaurant assigned to this account. Please contact support.",
    );
    return <Navigate to="/account/login" replace />;
  }

  return <Outlet />;
};

export default RestaurantAdminProtectedRoute;
