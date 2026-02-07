import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks/cartHooks";

const AdminProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  // Check if user is authenticated and has admin role
  if (!isAuthenticated || !user || user.role !== "platform_admin") {
    return <Navigate to="/account/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
