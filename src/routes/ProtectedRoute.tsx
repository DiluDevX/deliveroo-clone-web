import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks/cartHooks";

const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated,
  );
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/account/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
