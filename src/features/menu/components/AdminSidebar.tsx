import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Colors } from "../../../theme";
import { useNavigate } from "react-router-dom";

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
  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{
        width: drawerOpen ? 280 : 0,
        "& .MuiDrawer-paper": {
          width: 280,
          bgcolor: Colors.background.light,
          color: Colors.text.default,
          pt: 2,
          position: "fixed",
          pl: 6,
          zIndex: 98,
        },
      }}
    >
      <List sx={{ mt: 2, top: "60px" }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setDrawerOpen(false);
            }}
            sx={{
              mb: 1,
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ color: Colors.text.default, mr: -2, ml: 1 }}>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
