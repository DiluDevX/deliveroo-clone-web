import { Link, useLocation } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Button from "./Button";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchBar from "./SearchBar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors, Paddings, Svgs } from "../../../theme";
import AnchorTemporaryDrawer from "./AccountSideBar";
import React from "react";
import { getNameFromToken } from "../../../utils/common";

const Header = () => {
  const location = useLocation();
  const isTransparent = location.pathname === "/";
  const notShowing =
    location.pathname === "/SignPage/login" ||
    location.pathname === "/SignPage/signup";

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const token = localStorage.getItem("token");

  const title = getNameFromToken() || "Guest";

  return (
    <Box
      sx={{
        backgroundColor: isTransparent
          ? "transparent"
          : Colors.background.light,
        width: "100%",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: isTransparent ? "absolute" : "fixed",
        top: "0",
        zIndex: "101",
        paddingBottom: "3.2rem",
        paddingTop: "1rem",
        borderBottomWidth: isTransparent ? 0 : "0.5px",
        borderColor: Colors.border.subtle,
        borderStyle: "solid",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        <Box
          sx={{
            flex: 1,
            height: "100%",
            display: "flex",
            alignItems: "center",

            paddingTop: Paddings.Left.header.PaddingTop,
          }}
        >
          <Link to="/">
            <Svgs.DeliverooLogo height={32} />
          </Link>
        </Box>

        {location.pathname.startsWith("/restaurants/") &&
          location.pathname.endsWith("/menu") && (
            <Box
              sx={{
                flex: 2,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "1rem",
              }}
            >
              <SearchBar />
            </Box>
          )}

        <Box
          sx={{
            flex: 1,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
            paddingTop: Paddings.Left.header.PaddingTop,
          }}
        >
          {location.pathname === "/" && (
            <Button
              variant="border"
              PrefixIcon={ExpandMoreIcon}
              title="Partner with Us"
              sx={{ backgroundColor: Colors.background.light }}
            />
          )}

          {!token && (
            <Button
              PrefixIcon={HomeOutlinedIcon}
              title="Sign up or login"
              linkTo="/Account"
              sx={{
                backgroundColor: Colors.background.light,
                display: notShowing ? "none" : "flex",
              }}
            />
          )}

          <Button
            PrefixIcon={Person2OutlinedIcon}
            variant="border"
            title={title}
            sx={{
              backgroundColor: Colors.background.light,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px",
            }}
            onClick={() => toggleDrawer(true)}
          />
        </Box>
        <AnchorTemporaryDrawer open={drawerOpen} toggleDrawer={toggleDrawer} />
      </Container>
    </Box>
  );
};

export default Header;
