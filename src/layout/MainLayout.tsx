import { Outlet } from "react-router-dom";
import Footer from "../features/menu/components/Footer";
import Header from "../features/menu/components/Header";
import ScrollToTop from "../features/menu/components/ScrollToTop";
import { useCartSync } from "../store/hooks/useCartSync";
import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks/cartHooks";
import { setAuthInitialized, setCredentials } from "../store/authSlice";
import { checkAuthStatus, refreshToken } from "../services/auth.service";

const MainLayout = () => {
  // Sync cart with server when user logs in
  useCartSync();

  const dispatch = useAppDispatch();
  useEffect(() => {
    const isMounted = true;
    const checkAuth = async () => {
      let isAuthenticated = false;
      try {
        let result = await checkAuthStatus();
        if (result) {
          if (isMounted) {
            dispatch(setCredentials({ user: result.user }));
          }
          isAuthenticated = true;
          return;
        }

        // Try refresh token if checkAuthStatus failed
        await refreshToken();
        result = await checkAuthStatus();
        if (result) {
          if (isMounted) {
            dispatch(setCredentials({ user: result.user }));
          }
          isAuthenticated = true;
          return;
        }
      } catch (error) {
        // Error refreshing token
        console.error("Error refreshing token", error);
      } finally {
        if (isMounted) {
          if (!isAuthenticated) {
            dispatch(setCredentials({}));
          }
          dispatch(setAuthInitialized(true));
        }
      }
    };

    void checkAuth();
  }, [dispatch]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        overflow: "visible",
      }}
    >
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
