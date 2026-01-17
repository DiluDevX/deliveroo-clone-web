import { Box, Typography } from "@mui/material";
import { Colors } from "../../../theme";

const MealDeal = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "365px",
        padding: "2rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <img
          src="https://assets.dilum.me/deliveroo-clone/svgs/MealDealsBackground.svg"
          alt="Meal Deals Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
          alignItems: "center",
          color: Colors.text.inverse,
          zIndex: 2,
          position: "relative",
          padding: "2rem",
          paddingBottom: "4rem",
        }}
      >
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <img
            src="https://assets.dilum.me/deliveroo-clone/svgs/merch-sparkleleft.svg"
            alt="Sparkle Left"
            style={{
              minWidth: "50px",
              width: "8%",
              height: "auto",
              marginRight: "0.5rem",
            }}
          />
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3rem" },
              paddingLeft: "0.1rem",
              paddingRight: "0.1rem",
              textAlign: "center",
              color: Colors.text.inverse,
            }}
          >
            Up to 25% off meal deals
          </Typography>
          <img
            src="https://assets.dilum.me/deliveroo-clone/svgs/merch-sparkleright.svg"
            alt="Sparkle Right"
            style={{
              minWidth: "50px",
              width: "8%",
              height: "auto",
              objectFit: "contain",
              marginLeft: "0.5rem",
            }}
          />
        </Box>

        <Typography
          sx={{
            textAlign: "center",
            mb: "0.5rem",
            mt: "1rem",
            fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" },
            color: Colors.text.inverse,
          }}
        >
          Need a midweek pick-me-up, a break from cooking for the family or just
          <br />
          fancy your favourite restaurant?
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            mb: "1.3rem",
            fontSize: { xs: "0.7rem", sm: "0.9rem", md: "1rem" },
            color: Colors.text.inverse,
          }}
        >
          Subject to availability. Participating restaurants only.
          Service/delivery fees apply. T&Cs
        </Typography>
      </Box>

      <img
        src="https://assets.dilum.me/deliveroo-clone/svgs/merch-itemrow.svg"
        alt="item-row"
        style={{
          minHeight: "40px",
          paddingTop: "0.5rem",
          width: "100%",
          height: "auto",
          position: "absolute",
          bottom: 0,
          marginTop: "auto",
        }}
      />
    </Box>
  );
};

export default MealDeal;
