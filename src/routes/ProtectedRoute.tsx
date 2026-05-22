import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks/cartHooks";

const ProtectedRoute = () => {
  const { isAuthenticated, isAuthInitialized } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  if (!isAuthInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/account/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
