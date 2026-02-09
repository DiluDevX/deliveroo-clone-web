import { Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "@tanstack/react-router";
import Button from "../features/menu/components/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Colors } from "../theme";

const RecoveryConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract search params from location
  const searchParams = new URLSearchParams(location.search);
  const recoveryType = searchParams.get("type") || "recovery";
  const inputType = searchParams.get("inputType") || "email";

  const isForgotPassword = recoveryType === "forgotPassword";
  const isEmail = inputType === "email";
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
        {isForgotPassword
          ? isEmail
            ? "Check Your Email"
            : "Check Your Phone"
          : "Recovery Link Sent!"}
      </Typography>
      <Typography
        sx={{ fontSize: "1rem", color: Colors.text.placeholder, mb: 4 }}
      >
        {isForgotPassword
          ? isEmail
            ? "A password reset link has been sent to your email. Please check your inbox and spam folder."
            : "A recovery link has been sent to your phone. Follow the instructions to regain access to your account."
          : "A recovery link has been sent to your email or phone. Follow the instructions to recover your account."}
      </Typography>

      <Button
        onClick={() => navigate({ to: "/account/login" })}
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
