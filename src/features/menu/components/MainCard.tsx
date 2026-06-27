import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { Colors } from "../../../theme";

interface MainCardProps {
  image: string;
  title: string;
  description: string;
}

const MainCard: React.FC<MainCardProps> = ({ image, title, description }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: { xs: "auto", sm: "450px" },
        mt: 2,
        mb: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "250px",
          overflow: "hidden",
          borderRadius: "10px",
          marginBottom: "10px",
          position: "relative",
          justifyContent: "flex-start",
        }}
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "10px",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
          }}
        />
      </Box>

      <Box sx={{ flexGrow: { xs: 0, sm: 1 } }}>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "left",
            color: Colors.text.default,
            fontSmoothing: "antialiased",
            marginBottom: "15px",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.8rem",
            color: Colors.text.default,
            fontSmoothing: "antialiased",
            marginBottom: { xs: "0.75rem", sm: "1px" },
            textAlign: "left",
          }}
        >
          {description}
        </Typography>
      </Box>
      <IconButton
        sx={{
          backgroundColor: Colors.background.brand,
          color: Colors.text.inverse,
          fontSize: "0.9rem",
          fontWeight: "bold",
          borderRadius: "3px",
          width: { xs: "100%", sm: "50%" },
          maxWidth: "100%",
          fontSmoothing: "antialiased",
          py: "0.7rem",
          marginTop: { xs: 0, sm: "-20px" },
          "&:hover": {
            backgroundColor: Colors.background.brandHover,
          },
        }}
      >
        Get Started
      </IconButton>
    </Box>
  );
};

export default MainCard;
