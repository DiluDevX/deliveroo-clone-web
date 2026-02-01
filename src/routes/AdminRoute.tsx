import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks/cartHooks";

const AdminRoute = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (user?.role !== "admin" || !isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  } else {
    return <Outlet />;
  }
};

export default AdminRoute;
