import Lottie from "react-lottie-player";
import loadingAnimation from "../../../assets/animations/lottie-loading-dot-animation.json";
import { Colors } from "../../../theme";
import { Box } from "@mui/material";

type LoadingIndicatorProps = {
  variant?: "button";
  text?: string;
};

const LoadingIndicator = ({ variant, text }: LoadingIndicatorProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: variant === "button" ? "auto" : "100vh",
        width: variant === "button" ? "auto" : "100%",
      }}
    >
      <span style={{ color: Colors.background.brand }}>{text}</span>

      <Lottie
        loop
        animationData={loadingAnimation}
        play
        style={{
          width: variant === "button" ? 30 : 150,
          height: variant === "button" ? 30 : 150,
          color: Colors.background.brand,
        }}
      />
    </Box>
  );
};

export default LoadingIndicator;
