import { Colors } from "../../../theme";
import { Box, CircularProgress } from "@mui/material";

type LoadingIndicatorProps = {
  variant?: "button" | "bar";
  text?: string;
};

const LoadingIndicator = ({ variant, text }: LoadingIndicatorProps) => {
  if (variant === "bar") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1.5,
          fontFamily: "IBM Plex Sans, serif",
          width: "100%",
        }}
      >
        {text && (
          <span
            style={{ color: Colors.background.brand, fontSize: "0.875rem" }}
          >
            {text}
          </span>
        )}
        <Box
          sx={{
            width: "100%",
            maxWidth: "300px",
            height: "4px",
            bgcolor: "rgba(0, 0, 0, 0.1)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              bgcolor: Colors.background.brand,
              animation: "progress 1.5s ease-in-out infinite",
              "@keyframes progress": {
                "0%": { width: "0%", marginLeft: "0%" },
                "50%": { width: "100%", marginLeft: "0%" },
                "100%": { width: "100%", marginLeft: "100%" },
              },
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: variant === "button" ? "auto" : "100vh",
        width: variant === "button" ? "auto" : "100%",
        fontSize: variant === "button" ? "0.875rem" : "1.25rem",
        fill: Colors.text.default,
        fontFamily: "IBM Plex Sans, serif",
        gap: variant === "button" ? 0.75 : 2,
      }}
    >
      <span style={{ color: Colors.background.brand }}>{text}</span>

      <CircularProgress
        size={variant === "button" ? 22 : 56}
        thickness={4}
        sx={{
          color: Colors.background.brand,
        }}
      />
    </Box>
  );
};

export default LoadingIndicator;
