import { Link } from "@tanstack/react-router";
import { Box, Typography } from "@mui/material";
import Button from "./Button";
import { Colors } from "../../../theme";
import { useState } from "react";
import { Notifications, NotificationsOffRounded } from "@mui/icons-material";
import { showSuccessSnackbar } from "../../../utils/notifications";

const AdminHeader = () => {
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
        zIndex: "101",
        borderBottomWidth: "0.5px",
        borderColor: Colors.border.subtle,
        borderStyle: "solid",
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
          px: 2,
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
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
              style={{ height: 32, marginLeft: 10 }}
            />

            <Typography sx={{ pl: 2, fontWeight: 800, fontSize: 20 }}>
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
