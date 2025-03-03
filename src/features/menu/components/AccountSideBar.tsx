import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Link, useNavigate } from "react-router-dom";
import { Colors, Svgs } from "../../../theme";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { IconButton, Typography } from "@mui/material";
import Button from "./Button";

import ShowBarWithProgress from "./ShowBarWithProgress";
import { getNameFromToken } from "../../../utils/common";

type AnchorTemporaryDrawerProps = {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
};

export default function AnchorTemporaryDrawer({
  open,
  toggleDrawer,
}: Readonly<AnchorTemporaryDrawerProps>) {
  const token = localStorage.getItem("token");
  const firstName = getNameFromToken();

  function LogOut() {
    localStorage.clear();
    window.location.reload();
  }

  const navigate = useNavigate();

  const list = () => (
    <Box
      width={{ xs: "18rem", sm: "20rem", md: "22rem" }}
      zIndex={1000}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <Box
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          display: "flex",
        }}
      >
        <Link to="/" onClick={() => toggleDrawer(false)}>
          <Svgs.DeliverooLogo
            style={{ margin: "1rem 1rem", cursor: "pointer" }}
          />
        </Link>
        <IconButton onClick={() => toggleDrawer(false)} sx={{ mr: "0.5rem" }}>
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

      {!token && (
        <Box>
          <Link to={"/Account"} style={{ textDecoration: "none" }}>
            <Button
              onClick={() => toggleDrawer(false)}
              style={{
                textDecoration: "none",
                alignItems: "center",
                marginLeft: "1rem",
                width: "90%",
                marginTop: "4rem",
                backgroundColor: Colors.background.brand,
                color: Colors.text.inverse,
              }}
            >
              Log in or Sign up
            </Button>
          </Link>
        </Box>
      )}
      {token && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              mt: "4rem",
              mb: "2rem",
              fontSize: "2rem",
              fontWeight: "bold",
              color: Colors.text.default,
            }}
          >
            {`Hello! ${firstName || "Guest"}`}
          </Typography>
          {token && (firstName === "" || firstName === undefined) && (
            <Box
              onClick={() => {
                navigate("/Account/CompleteSignUp");
                toggleDrawer(false);
              }}
            >
              <ShowBarWithProgress />
            </Box>
          )}
          <Button
            sx={{
              mt: 5,
              width: "100%",
              maxWidth: "90%",
              backgroundColor: Colors.background.brand,
              color: Colors.text.inverse,
              fontWeight: "bold",
              padding: "0.8rem",
              borderRadius: "8px",
            }}
          >
            Dashboard
          </Button>
          <Button
            sx={{
              mt: 2,
              width: "100%",
              maxWidth: "90%",
              backgroundColor: Colors.background.brand,
              color: Colors.text.inverse,
              fontWeight: "bold",
              padding: "0.8rem",
              borderRadius: "8px",
            }}
          >
            Settings
          </Button>

          <Button
            sx={{
              mt: 2,
              width: "100%",
              maxWidth: "90%",
              backgroundColor: Colors.background.brand,
              color: Colors.text.inverse,
              fontWeight: "bold",
              padding: "0.8rem",
              borderRadius: "8px",
            }}
          >
            Checkout
          </Button>
          <Button
            onClick={LogOut}
            sx={{
              mt: 2,
              width: "100%",
              maxWidth: "90%",
              backgroundColor: Colors.background.brand,
              color: Colors.text.inverse,
              fontWeight: "bold",
              padding: "0.8rem",
              borderRadius: "8px",
            }}
          >
            Log Out
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer anchor="right" open={open} onClose={() => toggleDrawer(false)}>
      {list()}
    </Drawer>
  );
}
