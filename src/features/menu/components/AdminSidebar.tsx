import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Colors } from "../../../theme";
import { useLocation, useNavigate } from "react-router-dom";

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

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{
        width: isMobile ? (drawerOpen ? 280 : 0) : 280,
        "& .MuiDrawer-paper": {
          width: 280,
          bgcolor: Colors.background.light,
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
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {menuItems.map((item) => {
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
                mb: 0.5,
                py: 1.25,
                borderLeft: "3px solid",
                borderLeftColor: isSelected
                  ? Colors.background.brand
                  : "transparent",
                backgroundColor: isSelected
                  ? Colors.background.default
                  : "transparent",
                "&.Mui-selected": {
                  backgroundColor: Colors.background.default,
                },
                "&.Mui-selected:hover": {
                  backgroundColor: Colors.background.default,
                },
                "&:hover": { backgroundColor: Colors.background.default },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isSelected
                    ? Colors.background.brand
                    : Colors.text.placeholder,
                  minWidth: 48,
                  ml: 2,
                }}
              >
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  sx: {
                    fontWeight: isSelected ? 800 : 400,
                    fontSize: 14,
                    color: isSelected
                      ? Colors.text.default
                      : Colors.text.placeholder,
                  },
                }}
                primary={item.label}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
