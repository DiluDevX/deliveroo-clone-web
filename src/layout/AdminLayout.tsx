import { useState, useEffect, useMemo } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, useNavigate } from "@tanstack/react-router";
import {
  Settings,
  Home,
  Person,
  FoodBank,
  DeliveryDining,
  AttachMoneyTwoTone,
} from "@mui/icons-material";
import { Colors } from "../theme";
import AdminSidebar from "../features/menu/components/AdminSidebar";
import AdminHeader from "../features/menu/components/AdminHeader";
import { setAuthInitialized, setCredentials } from "../store/authSlice";
import { getValidAdminAuth } from "../services/auth.service";
import { useAppDispatch } from "../store/hooks/cartHooks";
import { showErrorSnackbar } from "../utils/notifications";

const AdminLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuthAdmin = async () => {
      let result = null;
      try {
        result = await getValidAdminAuth();
        if (!result) {
          navigate({ to: "/account/login" });
        }
      } catch {
        showErrorSnackbar("Authentication check failed. Please log in again.");
        navigate({ to: "/account/login" });
      } finally {
        if (result) {
          dispatch(setCredentials({ user: result.user }));
        } else {
          dispatch(setCredentials({}));
        }
        dispatch(setAuthInitialized(true));
      }
    };

    void checkAuthAdmin();
    return () => {};
  }, [dispatch, navigate]);

  const [drawerOpen, setDrawerOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = useMemo(
    () => [
      { label: "Dashboard", icon: Home, path: "/admin/dashboard" },
      { label: "Restaurants", icon: FoodBank, path: "/admin/restaurants" },
      { label: "Orders", icon: DeliveryDining, path: "/admin/orders" },
      { label: "Users", icon: Person, path: "/admin/users" },
      { label: "Finance", icon: AttachMoneyTwoTone, path: "/admin/finance" },
      { label: "Settings", icon: Settings, path: "/admin/settings" },
    ],
    [],
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
          zIndex: 100,
        }}
      >
        <AdminHeader />
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

        <Box sx={{ flex: 1, pl: 10, pr: 10, overflow: "auto", pt: 4, pb: 6 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
