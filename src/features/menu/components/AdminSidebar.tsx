import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Colors } from "../../../theme";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    navigate(menuItems[selectedItem].path);
  }, [selectedItem, menuItems, navigate]);
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
        {menuItems.map((item, index) => (
          <ListItemButton
            key={item.label}
            disableRipple={true}
            onClick={() => {
              setSelectedItem(index);
              navigate(item.path);
              if (isMobile) setDrawerOpen(false);
            }}
            sx={{
              mb: 1,
              backgroundColor: "transparent",
              "&:hover": { backgroundColor: "transparent" },
              "&:focus": { backgroundColor: "transparent" },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  selectedItem === index
                    ? Colors.background.brand
                    : Colors.text.placeholder,
                mr: -3,
                ml: 2,
              }}
            >
              <item.icon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                sx: {
                  fontWeight: selectedItem === index ? 800 : 400,
                  fontSize: 14,
                  color:
                    selectedItem === index
                      ? Colors.text.default
                      : Colors.text.placeholder,
                },
              }}
              primary={item.label}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
