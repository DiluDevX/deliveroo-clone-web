import { Outlet } from "react-router-dom";
import Footer from "../features/menu/components/Footer";
import Header from "../features/menu/components/Header";
import ScrollToTop from "../features/menu/components/ScrollToTop";
import { useCartSync } from "../store/hooks/useCartSync";
import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks/cartHooks";
import { setAuthInitialized, setCredentials } from "../store/authSlice";
import { getValidAuth } from "../services/auth.service";

const MainLayout = () => {
  // Sync cart with server when user logs in
  useCartSync();

  const dispatch = useAppDispatch();
  useEffect(() => {
    const checkAuth = async () => {
      let result = null;
      try {
        result = await getValidAuth();
      } catch {
        // Auth check failed
      } finally {
        if (result) {
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
