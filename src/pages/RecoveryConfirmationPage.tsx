import { Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../features/menu/components/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Colors } from "../theme";

const RecoveryConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isPasswordReset = location.state?.type === "passwordReset";

  return (
    <Box
      sx={{
        mt: 30,
        mb: 20,
        justifyContent: "center",
        height: "auto",
        display: "flex",
        alignItems: "center",
        marginLeft: "1.1rem",
        marginRight: "1.5rem",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          mb: 2,
          color: Colors.text.default,
        }}
      >
        {isPasswordReset ? "Check Your Email" : "Recovery Link Sent!"}
      </Typography>
      <Typography
        sx={{ fontSize: "1rem", color: Colors.text.placeholder, mb: 4 }}
      >
        {isPasswordReset
          ? "We’ve sent you a link to reset your password. Please check your inbox."
          : "We've sent a recovery link to your email or phone. Follow the instructions to recover your account."}
      </Typography>

      <Button
        onClick={() => navigate("/account/login")}
        PrefixComponent={<ArrowBackIcon sx={{ height: "1.3rem" }} />}
        sx={{
          border: "none",
          color: Colors.background.brand,
          fontSize: "1rem",
          fontWeight: "normal",
          borderRadius: "150px",
          mt: 2,
          "&:hover": {
            border: "none",
          },
        }}
      >
        Back to Login
      </Button>
    </Box>
  );
};

export default RecoveryConfirmationPage;
