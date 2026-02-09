import { Outlet, useNavigate } from "@tanstack/react-router";
import { useAppSelector } from "../store/hooks/cartHooks";
import { useEffect } from "react";

const AdminProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "platform_admin") {
      navigate({ to: "/account/login" });
    }
  }, [isAuthenticated, user, navigate]);

  // Check if user is authenticated and has admin role
  if (!isAuthenticated || !user || user.role !== "platform_admin") {
    return null;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
