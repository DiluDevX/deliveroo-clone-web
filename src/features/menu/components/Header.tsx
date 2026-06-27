import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Container, InputAdornment, TextField } from "@mui/material";
import Button from "./Button";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Colors, Paddings, Svgs } from "../../../theme";
import AnchorTemporaryDrawer from "./AccountSideBar";
import React from "react";
import PartnerWithUs from "./PartnerWithUs";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  RESTAURANT_MENU_SEARCH_LABEL_EVENT,
  RestaurantMenuSearchLabelEventDetail,
  openRestaurantMenuSearch,
} from "../events/restaurant-menu-search.events";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isTransparent = location.pathname === "/";
  const isRestaurantMenuPage =
    location.pathname.startsWith("/restaurants/") &&
    location.pathname.endsWith("/menu");
  const notShowing =
    location.pathname === "/Account/login" ||
    location.pathname === "/Account/signup" ||
    location.pathname === "/account";

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [restaurantSearchName, setRestaurantSearchName] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    const handleRestaurantSearchLabel = (event: Event) => {
      const customEvent =
        event as CustomEvent<RestaurantMenuSearchLabelEventDetail>;
      setRestaurantSearchName(customEvent.detail.restaurantName);
    };

    globalThis.addEventListener(
      RESTAURANT_MENU_SEARCH_LABEL_EVENT,
      handleRestaurantSearchLabel,
    );

    return () => {
      globalThis.removeEventListener(
        RESTAURANT_MENU_SEARCH_LABEL_EVENT,
        handleRestaurantSearchLabel,
      );
    };
  }, []);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const user = useSelector((state: RootState) => state.auth.user);

  const handleAccountNavigation = () => {
    sessionStorage.removeItem("redirectAfterLogin");
    navigate("/account");
  };

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
        px: { xs: "0.5rem", sm: "1rem" },
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
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr) auto",
            md: "minmax(170px, 240px) minmax(0, 760px) minmax(150px, 240px)",
          },
          columnGap: { xs: 1, md: 3 },
          alignItems: "flex-start",
          position: "relative",
          px: { xs: 0, sm: 2 },
        }}
      >
        <Box
          sx={{
            flex: 1,
            height: "100%",
            display: "flex",
            alignItems: "center",
            minWidth: 0,
            ml: 0,
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

        {isRestaurantMenuPage && (
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              minWidth: 0,
              paddingTop: Paddings.Left.header.PaddingTop,
            }}
          >
            <TextField
              fullWidth
              size="small"
              value=""
              onFocus={openRestaurantMenuSearch}
              onClick={openRestaurantMenuSearch}
              placeholder={`Search ${restaurantSearchName || "restaurant menu"}`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon
                      sx={{ color: Colors.text.placeholder }}
                    />
                  </InputAdornment>
                ),
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: Colors.background.light,
                  borderRadius: "999px",
                  boxShadow: `0 1px 4px ${Colors.boxShadow.default}`,
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiInputBase-input": {
                  py: 1.25,
                },
              }}
            />
          </Box>
        )}

        {!isRestaurantMenuPage && (
          <Box sx={{ display: { xs: "none", md: "block" } }} />
        )}

        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
            paddingTop: Paddings.Left.header.PaddingTop,
          }}
        >
          {location.pathname === "/" && <PartnerWithUs />}

          {isRestaurantMenuPage && (
            <Button
              PrefixComponent={
                <SearchOutlinedIcon
                  sx={{
                    width: "1.6rem",
                    height: "1.6rem",
                    color: Colors.background.brand,
                  }}
                />
              }
              variant="border"
              aria-label="Search restaurant menu"
              onClick={openRestaurantMenuSearch}
              sx={{
                backgroundColor: Colors.background.light,
                display: { xs: "flex", md: "none" },
                width: 42,
                minWidth: 42,
                height: 42,
                minHeight: 42,
                px: 0,
                py: 0,
              }}
            />
          )}

          {!user && isRestaurantMenuPage && (
            <Button
              PrefixIcon={HomeOutlinedIcon}
              variant="border"
              onClick={handleAccountNavigation}
              sx={{
                backgroundColor: Colors.background.light,
                display: { xs: "flex", md: "flex", lg: "flex" },
                alignItems: "center",
                justifyContent: "center",
                px: { xs: "0.65rem", sm: "1rem" },
                minWidth: { xs: 42, sm: 148 },
                maxWidth: { xs: "48vw", sm: "none" },
                overflow: "hidden",
                "& span": {
                  display: { xs: "none", sm: "inline-flex" },
                },
                "@media (min-width:360px)": {
                  "& span": {
                    display: "inline-flex",
                  },
                },
              }}
            >
              <Box component="span">Sign up or login</Box>
            </Button>
          )}

          {!user &&
            !notShowing &&
            !isRestaurantMenuPage &&
            location.pathname !== "/account/login" &&
            location.pathname !== "/account/signup" && (
              <Button
                PrefixIcon={Person2OutlinedIcon}
                title="Login or Signup"
                onClick={() => {
                  sessionStorage.removeItem("redirectAfterLogin");
                  navigate("/account/login");
                }}
                showTitleOnMobile={false}
                sx={{
                  backgroundColor: Colors.background.light,
                  display: "flex",
                  "& > .MuiTypography-root": {
                    display: "none !important",
                    "@media (min-width:380px)": {
                      display: "flex !important",
                    },
                  },
                }}
              />
            )}
          {location.pathname !== "/account" && user && (
            <Button
              PrefixIcon={Person2OutlinedIcon}
              variant="border"
              title={title}
              showTitleOnMobile
              sx={{
                backgroundColor: Colors.background.light,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: "0.6rem", sm: "0.75rem" },
                py: "6px",
                mr: { xs: 0, sm: "-0.4rem" },
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
