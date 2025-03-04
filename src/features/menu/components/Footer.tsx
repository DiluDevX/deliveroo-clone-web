import { Box, Container, Typography, Grid2 as Grid } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import TwitterIcon from "@mui/icons-material/Twitter";
import { GooglePlayButton, AppStoreButton } from "react-mobile-app-button";
import { Colors } from "../../../theme";

const Footer = () => {
  return (
    <div
      style={{
        backgroundColor: Colors.background.darker,
        paddingTop: "2rem",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          width: { xs: "100%", sm: "100%", md: "100%", lg: "80%" },
          color: Colors.text.inverse,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: Colors.background.dark,
            padding: "1.5rem",
            flex: 1,
            minWidth: { xs: "100%", sm: "40%", md: "40%", lg: "auto" },
            maxHeight: { xs: "200px", sm: "300px", md: "200px", lg: "450px" },
            minHeight: { xs: "200px", sm: "200px", md: "200px", lg: "450px" },
            maxWidth: { xs: "100vw", sm: "50vw", md: "auto", lg: "auto" },
          }}
        >
          <Typography
            variant="h6"
            sx={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: "bold" }}
          >
            Discover
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8rem",
              marginBottom: "1rem",
              "&:hover": {
                color: Colors.background.brand,
                cursor: "pointer",
              },
            }}
          >
            Deliveroo
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8rem",
              marginBottom: "1rem",
              "&:hover": {
                color: Colors.background.brand,
                cursor: "pointer",
              },
            }}
          >
            Investors
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8rem",
              marginBottom: "1rem",
              "&:hover": {
                color: Colors.background.brand,
                cursor: "pointer",
              },
            }}
          >
            About Us
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: Colors.background.dark,
            padding: "1.5rem",
            flex: 1,
            minWidth: { xs: "100%", sm: "50%", md: "50%", lg: "auto" },

            minHeight: { xs: "200px", sm: "200px", md: "200px", lg: "450px" },
            maxWidth: { xs: "100vw", sm: "50vw", md: "auto", lg: "auto" },
          }}
        >
          <Typography
            variant="h6"
            sx={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: "bold" }}
          >
            Legal
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8rem",
              marginBottom: "1rem",
              "&:hover": {
                color: Colors.background.brand,
                cursor: "pointer",
              },
            }}
          >
            Terms & Conditions
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8rem",
              marginBottom: "1rem",
              "&:hover": {
                color: Colors.background.brand,
                cursor: "pointer",
              },
            }}
          >
            Privacy
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: Colors.background.dark,
            padding: "1.5rem",
            flex: 1,
            minWidth: "200px",
            width: { xs: "100vw", sm: "50%", md: "50%", lg: "auto" },

            minHeight: { xs: "200px", sm: "200px", md: "200px", lg: "450px" },
            maxWidth: { xs: "100vw", sm: "50vw", md: "auto", lg: "auto" },
          }}
        >
          <Typography
            variant="h6"
            sx={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: "bold" }}
          >
            Help
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8rem",
              marginBottom: "1rem",
              "&:hover": {
                color: Colors.background.brand,
                cursor: "pointer",
              },
            }}
          >
            Contact
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8rem",
              marginBottom: "1rem",
              "&:hover": {
                color: Colors.background.brand,
                cursor: "pointer",
              },
            }}
          >
            FAQs
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: Colors.background.dark,
            padding: "1.5rem",
            flex: 1,
            minWidth: { xs: "100%", sm: "50%", md: "50%", lg: "auto" },
            maxHeight: { xs: "200px", sm: "200px", md: "200px", lg: "450px" },
            minHeight: { xs: "200px", sm: "200px", md: "200px", lg: "450px" },
            maxWidth: { xs: "100vw", sm: "50vw", md: "auto", lg: "auto" },
          }}
        >
          <Typography
            variant="h6"
            sx={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: "bold" }}
          >
            Take Deliveroo with you
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
              <AppStoreButton theme={"dark"} width={200} height={50} url={""} />
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
              <GooglePlayButton
                theme={"dark"}
                width={200}
                height={50}
                url={""}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            top: "0",
            width: "100%",
            color: Colors.text.inverse,
            justifyContent: "space-between",
            marginTop: "-1.5rem",
            marginBottom: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "0.6rem",
              marginTop: "1rem",
            }}
          >
            <FacebookOutlinedIcon />
            <InstagramIcon />
            <TwitterIcon />
          </Box>
          <Box right={0}>
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: Colors.text.light,
                mt: "1rem",
              }}
            >
              © 2025 Deliveroo
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Footer;
