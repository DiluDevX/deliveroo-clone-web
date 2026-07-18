import { Link } from "react-router-dom";
import { Box, IconButton, Typography } from "@mui/material";
import Button from "./Button";
import { Colors } from "../../../theme";
import { useState } from "react";
import {
  CloseRounded,
  MenuRounded,
  Notifications,
  NotificationsOffRounded,
} from "@mui/icons-material";
import { showSuccessSnackbar } from "../../../utils/notifications";

interface AdminHeaderProps {
  isMobile: boolean;
  menuOpen: boolean;
  onMenuClick: () => void;
}

const AdminHeader = ({ isMobile, menuOpen, onMenuClick }: AdminHeaderProps) => {
  const [isNotificationsClicked, setIsNotificationsClicked] = useState(false);

  function handleNotificationsClick() {
    if (!isNotificationsClicked) {
      showSuccessSnackbar("Notifications Enabled");
    } else {
      showSuccessSnackbar("Notifications Disabled");
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: Colors.background.light,
        width: "100%",
        height: "60px",
        display: "flex",
        justifyContent: "center",
        position: "fixed",
        top: "0",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: `1px solid ${Colors.border.subtle}`,
        p: 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          px: { xs: 1, sm: 2 },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isMobile && (
            <IconButton
              aria-label={
                menuOpen ? "Close admin navigation" : "Open admin navigation"
              }
              onClick={onMenuClick}
              sx={{
                width: 40,
                height: 40,
                mr: 0.5,
                color: Colors.text.default,
              }}
            >
              {menuOpen ? <CloseRounded /> : <MenuRounded />}
            </IconButton>
          )}
          <Link
            to="/"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              textDecoration: "none",
              color: Colors.text.default,
            }}
          >
            <img
              src="https://assets.dilum.me/deliveroo-clone/images/delveroo-logo-no-text.png"
              alt="Deliveroo Logo"
              style={{ height: 32, marginLeft: isMobile ? 0 : 10 }}
            />

            <Typography
              sx={{
                pl: { xs: 1, sm: 2 },
                fontWeight: 800,
                fontSize: { xs: 17, sm: 20 },
                whiteSpace: "nowrap",
              }}
            >
              Admin Hub
            </Typography>
          </Link>
        </Box>

        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            PrefixIcon={
              isNotificationsClicked ? Notifications : NotificationsOffRounded
            }
            borderOff={true}
            sx={{
              backgroundColor: Colors.background.light,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setIsNotificationsClicked(!isNotificationsClicked);
              handleNotificationsClick();
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminHeader;
