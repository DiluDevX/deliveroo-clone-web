import { Box, Container, Typography, useMediaQuery } from "@mui/material";
import { GooglePlayButton, AppStoreButton } from "react-mobile-app-button";
import { Colors } from "../../../theme";

const LocationView = () => {
  const isMobile = useMediaQuery("(max-width:599.95px)");
  const storeButtonWidth = isMobile ? 124 : 200;
  const storeButtonHeight = isMobile ? 42 : 50;

  return (
    <Container
      sx={{
        width: "100%",
        padding: { xs: "1rem", sm: "2rem" },
        backgroundColor: Colors.background.light,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          width: "100%",
          borderRadius: "10px",
          boxShadow: `0px 2px 8px ${Colors.boxShadow.default}`,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            maxWidth: "100%",
            padding: { xs: "1rem", sm: "2rem" },
            flexGrow: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", sm: "2rem" },
              color: Colors.text.default,
            }}
          >
            Track orders to your door
          </Typography>
          <Typography
            sx={{
              color: Colors.text.default,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Get your favourite food delivered in a flash. You’ll see when your
            rider’s picked up your order and be able to follow them along the
            way. You’ll get a notification when they’re nearby, too.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: { xs: "0.5rem", sm: "1rem" },
              flexWrap: "nowrap",
              alignItems: "center",
              "& .landing-store-button": {
                boxSizing: "border-box",
                flexShrink: 0,
                gap: { xs: "0.35rem", sm: "0.625rem" },
                padding: { xs: "0.4rem 0.45rem", sm: "0.625rem" },
              },
              "& .landing-store-button img": {
                width: { xs: "1.25rem", sm: "auto" },
                height: { xs: "1.25rem", sm: "auto" },
              },
              "& .landing-store-button .button-title": {
                fontSize: { xs: "0.5rem", sm: "0.75rem" },
                lineHeight: 1,
                whiteSpace: "nowrap",
              },
              "& .landing-store-button .button-store-name": {
                fontSize: { xs: "0.82rem", sm: "1.25rem" },
                lineHeight: 1.05,
                whiteSpace: "nowrap",
              },
            }}
          >
            <AppStoreButton
              theme={"dark"}
              width={storeButtonWidth}
              height={storeButtonHeight}
              url={""}
              className="landing-store-button"
            />

            <GooglePlayButton
              theme={"dark"}
              width={storeButtonWidth}
              height={storeButtonHeight}
              url={""}
              className="landing-store-button"
            />
          </Box>
        </Box>

        <Box sx={{ width: "100%", height: "auto", position: "relative" }}>
          <img
            src="https://img2.storyblok.com/filters:format(webp)/f/62776/x/ca59b51c51/map-min.svg"
            alt="map"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />

          <Box
            sx={{
              "@media (max-width: 400px)": {
                width: "170px",
                top: "-6%",
                right: "-4%",
              },
              width: {
                xs: "220px",
                sm: "350px",
                md: "400px",
                lg: "350px",
              },
              position: "absolute",
              top: "-2%",
              right: { xs: "-2%", sm: "-2%", md: "-1%", lg: "-2%" },
              backgroundColor: "transparent",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              alt="notification-img"
              src="https://assets.dilum.me/deliveroo-clone/images/notification.png"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LocationView;
