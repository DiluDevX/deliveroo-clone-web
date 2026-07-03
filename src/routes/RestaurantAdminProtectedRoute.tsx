import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks/cartHooks";

const RestaurantAdminProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const isRestaurantAdmin =
    user?.role === "restaurant_admin" || user?.role === "restaurant_user";

  // Check if user is authenticated and has restaurant admin role
  if (!isAuthenticated || !isRestaurantAdmin || !user?.restaurantId) {
    return <Navigate to="/account/login" replace />;
  }

  return <Outlet />;
};

export default RestaurantAdminProtectedRoute;
