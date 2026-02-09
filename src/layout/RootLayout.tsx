import { useLocation } from "@tanstack/react-router";
import MainLayout from "./MainLayout";
import AdminLayout from "./AdminLayout";
import RestaurantAdminLayout from "./RestaurantAdminLayout";

const RootLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Render appropriate layout based on path
  if (pathname.startsWith("/admin")) {
    return <AdminLayout />;
  }

  if (pathname.startsWith("/restaurant")) {
    return <RestaurantAdminLayout />;
  }

  // Default to main layout
  return <MainLayout />;
};

export default RootLayout;
