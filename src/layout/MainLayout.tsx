import { Outlet } from "react-router-dom";
import Footer from "../features/menu/components/Footer";
import Header from "../features/menu/components/Header";
import ScrollToTop from "../features/menu/components/ScrollToTop";
import { useCartSync } from "../store/hooks/useCartSync";

const MainLayout = () => {
  // Sync cart with server when user logs in
  useCartSync();

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
