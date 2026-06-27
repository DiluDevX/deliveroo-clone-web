import React from "react";
import { Box } from "@mui/material";

interface MainCardProps {
  image: string;
}

const MainCard: React.FC<MainCardProps> = ({ image }) => {
  return (
    <Box
      sx={{
        width: "auto",
        height: "120px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 10px",
      }}
    >
      <img
        src={image}
        alt="Man Card"
        loading="lazy"
        decoding="async"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "10px",
        }}
      />
    </Box>
  );
};

export default MainCard;
