import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import {
  Dashboard,
  Restaurant,
  ShoppingCart,
  Settings,
  Fastfood,
} from "@mui/icons-material";
import { Colors } from "../theme";
import Header from "../features/menu/components/Header";
import AdminSidebar from "../features/menu/components/AdminSidebar";

const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { label: "Dashboard", icon: Dashboard, path: "/admin/dashboard" },
    { label: "Restaurants", icon: Restaurant, path: "/admin/restaurants" },
    { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
    { label: "Users", icon: Fastfood, path: "/admin/users" },
    { label: "Finance", icon: Fastfood, path: "/admin/finance" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: Colors.background.default,
      }}
    >
      <Box
        sx={{
          height: "64px",
          width: "100%",
          position: "fixed",
          zIndex: 100,
        }}
      >
        <Header />
      </Box>
      <Box
        sx={{
          display: "flex",
          mt: 12,
          p: 2,
          ml: isMobile ? 0 : drawerOpen ? 6 : 0,
          mr: isMobile ? 0 : drawerOpen ? 6 : 6,
        }}
      >
        <AdminSidebar
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          isMobile={isMobile}
          menuItems={menuItems}
        />
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
