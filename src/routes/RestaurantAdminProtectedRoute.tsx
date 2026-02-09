import { Outlet, useNavigate } from "@tanstack/react-router";
import { useAppSelector } from "../store/hooks/cartHooks";
import { useEffect } from "react";

const RestaurantAdminProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !isAuthenticated ||
      user?.role !== "restaurant_admin" ||
      !user?.restaurantId
    ) {
      navigate({ to: "/account/login" });
    }
  }, [isAuthenticated, user, navigate]);

  // Check if user is authenticated and has restaurant admin role
  if (
    !isAuthenticated ||
    user?.role !== "restaurant_admin" ||
    !user?.restaurantId
  ) {
    return null;
  }

  return <Outlet />;
};

export default RestaurantAdminProtectedRoute;
