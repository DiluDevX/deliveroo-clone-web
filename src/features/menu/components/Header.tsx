import { Link, useLocation } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Button from "./Button";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchBar from "./SearchBar";
import { Colors, Paddings, Svgs } from "../../../theme";
import AnchorTemporaryDrawer from "./AccountSideBar";
import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PartnerWithUs from "./PartnerWithUs";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const Header = () => {
  const location = useLocation();
  const isTransparent = location.pathname === "/";
  const notShowing =
    location.pathname === "/Account/login" ||
    location.pathname === "/Account/signup" ||
    location.pathname === "/account";

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const user = useSelector((state: RootState) => state.auth.user);

  const title = user?.firstName || "Guest";
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
            width: { xs: "170px", sm: "auto", md: "auto", lg: "auto" },
            ml: { xs: 0, sm: 0, md: 0, lg: "-1.5rem" },
            paddingTop: Paddings.Left.header.PaddingTop,
          }}
        >
          <Link to="/">
            <img
              src={Svgs.DeliverooLogo}
              alt="Deliveroo Logo"
              style={{ height: 32 }}
            />
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
          {location.pathname === "/" && <PartnerWithUs />}
          {location.pathname === "/menu" && (
            <Button
              variant="border"
              sx={{
                display: {
                  xs: "flex",
                  sm: "none",
                  md: "none",
                  lg: "none",
                },
              }}
              PrefixComponent={<SearchOutlinedIcon />}
            ></Button>
          )}

          {!user &&
            !notShowing &&
            location.pathname !== "/account/login" &&
            location.pathname !== "/account/signup" && (
              <Button
                PrefixIcon={HomeOutlinedIcon}
                onClick={() => sessionStorage.removeItem("redirectAfterLogin")}
                title="Sign up or login"
                linkTo="/account"
                sx={{
                  backgroundColor: Colors.background.light,
                  display: {
                    xs: "none",
                    sm: "none",
                    md: "flex",
                    lg: "flex",
                  },
                }}
              />
            )}
          {location.pathname !== "/account" && user && (
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
                mr: "-0.4rem",
              }}
              onClick={() => toggleDrawer(true)}
            />
          )}
        </Box>
        <AnchorTemporaryDrawer open={drawerOpen} toggleDrawer={toggleDrawer} />
      </Container>
    </Box>
  );
};

export default Header;
