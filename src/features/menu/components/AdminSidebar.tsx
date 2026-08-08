import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { LogoutRounded } from "@mui/icons-material";
import { Colors } from "../../../theme";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../../../store/hooks/cartHooks";
import { logOutUser } from "../../../store/authThunks";

export interface AdminSidebarProps {
  isMobile: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  menuItems: {
    label: string;
    icon: React.ElementType;
    path: string;
  }[];
}

const AdminSidebar = ({
  isMobile,
  drawerOpen,
  setDrawerOpen,
  menuItems,
}: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    await dispatch(logOutUser());
    setDrawerOpen(false);
    navigate("/account/login", { replace: true });
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{
        width: isMobile ? (drawerOpen ? 280 : 0) : 280,
        "& .MuiDrawer-paper": {
          width: 280,
          bgcolor: Colors.background.default,
          color: Colors.text.default,
          pt: 2,
          position: "fixed",
          zIndex: 98,
          alignItems: "center",
        },
      }}
    >
      <List
        sx={{
          mt: 2,
          top: "60px",
          display: "flex",
          flexDirection: "column",
          width: "calc(100% - 32px)",
          alignItems: "flex-start",
          justifyContent: "center",
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.subtle}`,
          borderRadius: "12px",
          overflow: "hidden",
          py: 0,
        }}
      >
        {menuItems.map((item, index) => {
          const isSelected =
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`);

          return (
            <ListItemButton
              key={item.label}
              selected={isSelected}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setDrawerOpen(false);
              }}
              sx={{
                width: "100%",
                py: 1.5,
                px: 3,
                position: "relative",
                backgroundColor: "transparent",
                transition: "background-color 0.2s ease",
                ...(index < menuItems.length - 1 && {
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 24,
                    right: 24,
                    bottom: 0,
                    height: "1px",
                    backgroundColor: Colors.border.subtle,
                  },
                }),
                "&.Mui-selected": {
                  backgroundColor: "transparent",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                },
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.02)" },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isSelected
                    ? Colors.background.brand
                    : Colors.text.default,
                  minWidth: 0,
                  mr: 2,
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.3rem",
                  },
                }}
              >
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  sx: {
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: isSelected
                      ? Colors.background.brand
                      : Colors.text.default,
                  },
                }}
                primary={item.label}
              />
            </ListItemButton>
          );
        })}
        <ListItemButton
          aria-label="Log out"
          disabled={isLoggingOut}
          onClick={() => void handleLogout()}
          sx={{
            width: "100%",
            py: 1.5,
            px: 3,
            borderTop: `1px solid ${Colors.border.subtle}`,
            color: Colors.error.main,
            "&:hover": { backgroundColor: Colors.error.lighter },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 0, mr: 2 }}>
            <LogoutRounded sx={{ fontSize: "1.3rem" }} />
          </ListItemIcon>
          <ListItemText
            primary={isLoggingOut ? "Logging out…" : "Log out"}
            primaryTypographyProps={{
              sx: { fontWeight: 500, fontSize: "1rem" },
            }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
