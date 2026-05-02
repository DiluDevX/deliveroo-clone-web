import { Outlet } from "react-router-dom";
import Footer from "../features/menu/components/Footer";
import Header from "../features/menu/components/Header";
import ScrollToTop from "../features/menu/components/ScrollToTop";
import { useCartSync } from "../store/hooks/useCartSync";
import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks/cartHooks";
import { setAuthInitialized, setCredentials } from "../store/authSlice";
import { populateDummyCart } from "../store/cartSlice";
import { checkAuthStatus, refreshToken } from "../services/auth.service";

const MainLayout = () => {
  // Sync cart with server when user logs in
  useCartSync();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      if (import.meta.env.VITE_BYPASS_AUTH === "true") {
        localStorage.setItem("selected-restaurant-id", "dummy-restaurant");
        dispatch(setAuthInitialized(true));
        dispatch(populateDummyCart());
        return;
      }

      let result = null;
      try {
        result = await checkAuthStatus();
        if (!result) {
          // Try refresh token if checkAuthStatus failed
          await refreshToken();
          result = await checkAuthStatus();
        }
      } catch (error) {
        // Error refreshing token
        console.error("Error refreshing token", error);
      } finally {
        if (result && typeof result !== "boolean") {
          dispatch(setCredentials({ user: result.user }));
        } else {
          dispatch(setCredentials({}));
        }
        dispatch(setAuthInitialized(true));
      }
    };

    void checkAuth();
    return () => {};
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
