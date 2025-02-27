import { Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../features/menu/components/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Colors } from "../theme";

const RecoveryConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isForgotPassword = location.state?.type === "forgotPassword";
  const inputType = location.state?.inputType === "email" ? "email" : "phone";

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
          ? inputType === "email"
            ? "Check Your Email"
            : "Check Your Phone"
          : "Recovery Link Sent!"}
      </Typography>
      <Typography
        sx={{ fontSize: "1rem", color: Colors.text.placeholder, mb: 4 }}
      >
        {isForgotPassword
          ? inputType === "email"
            ? "A password reset link has been sent to your email. Please check your inbox and spam folder."
            : "A recovery link has been sent to your phone. Follow the instructions to regain access to your account."
          : "A recovery link has been sent to your email or phone. Follow the instructions to recover your account."}
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
