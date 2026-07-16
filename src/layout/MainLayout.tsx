import { Outlet } from "react-router-dom";
import Footer from "../features/menu/components/Footer";
import Header from "../features/menu/components/Header";
import ScrollToTop from "../features/menu/components/ScrollToTop";
import { useCartSync } from "../store/hooks/useCartSync";
import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks/cartHooks";
import { setAuthInitialized, setCredentials } from "../store/authSlice";
import { clearCart, fetchCart, removeDummyCartItems } from "../store/cartSlice";
import { checkAuthStatus, refreshToken } from "../services/auth.service";
import { isCustomerUser } from "../utils/auth-role";

const MainLayout = () => {
  // Sync cart with server when user logs in
  useCartSync();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(removeDummyCartItems());

      let result = null;
      try {
        result = await checkAuthStatus();
        if (!result) {
          // Try refresh token if checkAuthStatus failed
          const refreshedTokens = await refreshToken();
          if (refreshedTokens) {
            dispatch(
              setCredentials({
                accessToken: refreshedTokens.accessToken,
                refreshToken: refreshedTokens.refreshToken,
              }),
            );
          }
          result = await checkAuthStatus();
        }
      } catch (error) {
        // Error refreshing token
        console.error("Error refreshing token", error);
      } finally {
        if (result && typeof result !== "boolean") {
          dispatch(setCredentials({ user: result.user }));
          if (isCustomerUser(result.user)) {
            dispatch(fetchCart());
          } else {
            dispatch(clearCart());
          }
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
