import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Link, useNavigate } from "react-router-dom";
import { Colors } from "../../../theme";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { IconButton, Typography, Divider } from "@mui/material";
import Button from "./Button";

import { store } from "../../../store/store";
import { useAppDispatch } from "../../../store/hooks/cartHooks";
import { logOutUser } from "../../../store/authThunks";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";

type AnchorTemporaryDrawerProps = {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
};

export default function AnchorTemporaryDrawer({
  open,
  toggleDrawer,
}: Readonly<AnchorTemporaryDrawerProps>) {
  const user = store.getState().auth.user;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: ShoppingCartIcon,
      label: "Cart",
      path: "/checkout",
      section: "Cart",
    },
    {
      icon: ReceiptIcon,
      label: "Orders",
      path: "/profile",
      section: "Order history",
    },
    {
      icon: LocationOnIcon,
      label: "Saved Addresses",
      path: "/profile",
      section: "Saved addresses",
    },
    {
      icon: CreditCardIcon,
      label: "Payments",
      path: "/profile",
      section: "Payments",
    },
    {
      icon: SettingsIcon,
      label: "Settings",
      path: "/profile",
      section: "Personal details",
    },
  ];

  const handleNavigation = (path: string, section?: string) => {
    navigate(path, { state: section ? { selectedItem: section } : undefined });
    toggleDrawer(false);
  };

  const handleLogout = async () => {
    await dispatch(logOutUser());
    toggleDrawer(false);
    navigate("/");
  };

  const list = () => (
    <Box
      width={{ xs: "18rem", sm: "20rem", md: "22rem" }}
      sx={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {!user && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link to="/account" style={{ textDecoration: "none" }}>
            <Button
              onClick={() => toggleDrawer(false)}
              style={{
                textDecoration: "none",
                width: "100%",
                backgroundColor: Colors.background.brand,
                color: Colors.text.inverse,
              }}
            >
              Log in or Sign up
            </Button>
          </Link>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={() => toggleDrawer(false)}
              sx={{ mr: "0.5rem" }}
            >
              <ClearOutlinedIcon
                style={{
                  width: "2rem",
                  height: "2rem",
                  color: Colors.background.brand,
                  cursor: "pointer",
                }}
              ></ClearOutlinedIcon>
            </IconButton>
          </Box>
        </Box>
      )}

      {user && (
        <>
          <Box sx={{ pl: 2, pb: 2, pt: 2, pr: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: Colors.background.brand,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: Colors.text.inverse,
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{ fontWeight: "bold", color: Colors.text.default }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography
                    sx={{ color: Colors.text.placeholder, fontSize: "0.85rem" }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => toggleDrawer(false)}>
                <ClearOutlinedIcon
                  style={{
                    width: "2rem",
                    height: "2rem",
                    color: Colors.background.brand,
                    cursor: "pointer",
                  }}
                ></ClearOutlinedIcon>
              </IconButton>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => handleNavigation(item.path, item.section)}
                style={{
                  justifyContent: "flex-start",
                  width: "100%",
                  backgroundColor: Colors.background.brand,
                  color: Colors.text.inverse,
                }}
              >
                <item.icon sx={{ mr: 1.5, fontSize: "1.25rem" }} />
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flex: 1 }} />

          <Divider />
          <Box sx={{ p: 2 }}>
            <Button
              onClick={handleLogout}
              style={{
                width: "100%",
                justifyContent: "flex-start",
                backgroundColor: Colors.background.brand,
                color: Colors.text.inverse,
              }}
            >
              <LogoutIcon sx={{ mr: 1 }} />
              Log out
            </Button>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Drawer anchor="right" open={open} onClose={() => toggleDrawer(false)}>
      {list()}
    </Drawer>
  );
}
