import { Box, Typography } from "@mui/material";
import React from "react";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { Colors } from "../../../theme";

type InfoButtonProps = {
  title: string;
  description: string;
  Icon: React.ReactNode;
  onClick?: () => void;
};

const InfoButton = ({ title, description, Icon, onClick }: InfoButtonProps) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        my: 1,
      }}
    >
      <Box>{Icon}</Box>
      <Box
        sx={{
          px: 2,
        }}
      >
        <Typography>{title}</Typography>
        <Typography sx={{ color: Colors.icon.info }}>{description}</Typography>
      </Box>
      <Box>
        <ChevronRightOutlinedIcon />
      </Box>
    </Box>
  );
};

export default InfoButton;
