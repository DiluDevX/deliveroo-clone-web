import { Box, Grid2 as Grid } from "@mui/material";
import MainViewSearchBox from "../components/MainViewSearchBox";
import { Colors } from "../../../theme/colors";

const MainView = () => {
  return (
    <Grid
      container
      sx={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.background.default,
        backgroundImage:
          "url(https://assets.dilum.me/deliveroo-clone/svgs/route.svg)",
        backgroundSize: { xs: "contain 30%", sm: "contain", md: "contain" },

        backgroundPosition: {
          xs: "left top",
          sm: "left top",
          md: "left top",
        },
        top: 0,
        backgroundRepeat: "no-repeat",
        padding: "2rem 1rem",
      }}
    >
      <Grid size={{ xs: 0, sm: 0, md: 0, lg: 4 }}>
        <Box
          sx={{
            display: { xs: "none", sm: "none", md: "none", lg: "flex" },
            position: "relative",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="https://assets.dilum.me/deliveroo-clone/images/left-2x.png"
            alt="Left Graphic"
            style={{
              position: "absolute",
              top: "80%",
              left: "60%",
              transform: "translate(-50%, -50%)",
              minWidth: "350px",
              width: "100%",
              height: "auto",
            }}
          />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, sm: 8, md: 8, lg: 4 }} sx={{ zIndex: 100, mt: 4 }}>
        <MainViewSearchBox />
      </Grid>

      <Grid size={{ xs: 0, sm: 4, md: 4, lg: 4 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: { xs: "none", sm: "flex", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="https://assets.dilum.me/deliveroo-clone/images/right-2x.png"
            alt="Right Graphic"
            style={{
              maxWidth: "1000px",
              translate: "16% ",
              width: "400%",
              height: "auto",
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default MainView;
