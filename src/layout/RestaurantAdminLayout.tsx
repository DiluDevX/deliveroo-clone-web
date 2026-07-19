import { useState, useMemo } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import {
  Settings,
  Home,
  AssignmentOutlined,
  RestaurantMenu,
  BarChart,
  GroupsOutlined,
} from "@mui/icons-material";
import { Colors } from "../theme";
import AdminSidebar from "../features/menu/components/AdminSidebar";
import AdminHeader from "../features/menu/components/AdminHeader";
import { useAppSelector } from "../store/hooks/cartHooks";
import {
  hasRestaurantCapability,
  RestaurantCapability,
} from "../utils/restaurant-permissions";

type RestaurantMenuItem = {
  label: string;
  icon: React.ElementType;
  path: string;
  capability: RestaurantCapability;
};

const RestaurantAdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const restaurantRole = useAppSelector(
    (state) => state.auth.user?.restaurantRole,
  );

  const menuItems = useMemo(
    () =>
      (
        [
          {
            label: "Dashboard",
            icon: Home,
            path: "/restaurant/dashboard",
            capability: "view_dashboard",
          },
          {
            label: "Orders",
            icon: AssignmentOutlined,
            path: "/restaurant/orders",
            capability: "manage_orders",
          },
          {
            label: "Menu",
            icon: RestaurantMenu,
            path: "/restaurant/menu",
            capability: "manage_menu",
          },
          {
            label: "Analytics",
            icon: BarChart,
            path: "/restaurant/analytics",
            capability: "view_analytics",
          },
          {
            label: "Team",
            icon: GroupsOutlined,
            path: "/restaurant/team",
            capability: "manage_team",
          },
          {
            label: "Settings",
            icon: Settings,
            path: "/restaurant/settings",
            capability: "manage_settings",
          },
        ] satisfies RestaurantMenuItem[]
      ).filter((item) =>
        hasRestaurantCapability(restaurantRole, item.capability),
      ),
    [restaurantRole],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: Colors.background.default,
      }}
    >
      <Box
        sx={{
          height: "64px",
          width: "100%",
          position: "fixed",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <AdminHeader
          isMobile={isMobile}
          menuOpen={drawerOpen}
          onMenuClick={() => setDrawerOpen((open) => !open)}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          mt: 8,
          flex: 1,
        }}
      >
        {!isMobile && (
          <Box sx={{ width: 280, flexShrink: 0, pl: 2 }}>
            <AdminSidebar
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              isMobile={isMobile}
              menuItems={menuItems}
            />
          </Box>
        )}

        {isMobile && (
          <AdminSidebar
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            isMobile={isMobile}
            menuItems={menuItems}
          />
        )}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            px: { xs: 2, sm: 3, md: 5, lg: 10 },
            overflow: "auto",
            pt: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 3, md: 6 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default RestaurantAdminLayout;
