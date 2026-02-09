import { Outlet, useNavigate } from "@tanstack/react-router";
import { useAppSelector } from "../store/hooks/cartHooks";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { isAuthenticated, isAuthInitialized } = useAppSelector(
    (state) => state.auth,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthInitialized && !isAuthenticated) {
      navigate({
        to: "/account/login",
      });
    }
  }, [isAuthenticated, isAuthInitialized, navigate]);

  if (!isAuthInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
