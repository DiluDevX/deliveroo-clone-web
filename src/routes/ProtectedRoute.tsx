import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks/cartHooks";
import {
  getOperationalDashboardPath,
  isCustomerUser,
} from "../utils/auth-role";

const ProtectedRoute = () => {
  const { isAuthenticated, isAuthInitialized, user } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  if (!isAuthInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/account/login" state={{ from: location }} replace />;
  }

  if (!isCustomerUser(user)) {
    return <Navigate to={getOperationalDashboardPath(user) ?? "/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
