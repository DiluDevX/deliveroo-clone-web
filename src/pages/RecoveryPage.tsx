import { Box, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import TextInput from "../features/menu/components/TextInput";
import { Colors } from "../theme";
import Button from "../features/menu/components/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingIndicator from "../features/menu/components/LoadingIndicator";
import { useState } from "react";
import { sendEmail } from "../services/mail.service";
import { useAppSelector } from "../store/hooks/cartHooks";
import {
  showErrorSnackbar,
  showSuccessSnackbar,
  showWarningSnackbar,
} from "../utils/notifications";

type RecoveryForm = {
  emailOrPhone: string;
  email?: string;
  phone?: string;
};

const RecoveryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  const isForgotEmail = location.state?.type === "forgotEmail";

  const schema = z.object({
    emailOrPhone: z
      .string()
      .min(7, "Please enter your registered phone number or email address"),
  });

  const form = useForm<RecoveryForm>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      emailOrPhone: user?.email || "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailOrPhone);
      const inputType = isEmail ? "email" : "phone";

      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (isEmail) {
        values.email = values.emailOrPhone;
        const result = await sendEmail(values.email);
        if (result) {
          showSuccessSnackbar("Email sent successfully");
        } else {
          showErrorSnackbar("Email not sent. Please try again.");
        }
        setIsSubmitting(false);
      } else {
        showWarningSnackbar(
          "Phone recovery not yet available. Please use email.",
        );
      }
      localStorage.setItem("emailOrPhone", values.emailOrPhone);
      navigate("/account/recovery-confirmation", {
        state: {
          type: isForgotEmail ? "forgotEmail" : "forgotPassword",
          inputType,
        },
      });
    } catch (error) {
      showErrorSnackbar("An error occurred. Please try again.");
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Box
      sx={{
        mt: 20,
        mb: 10,
        justifyContent: "center",
        height: "auto",
        display: "flex",
        alignItems: "center",
        marginLeft: "1.1rem",
        marginRight: "1.5rem",
        flexDirection: "column",
      }}
    >
      <Box sx={{ width: "100%", minWidth: "200px", maxWidth: "400px" }}>
        <Button
          onClick={() => window.history.back()}
          PrefixComponent={<ArrowBackIcon sx={{ height: "1.3rem" }} />}
          sx={{
            border: "none",
            color: Colors.background.brand,
            fontSize: "1rem",
            fontWeight: "normal",
            borderRadius: "150px",
            left: -20,
            mb: 3,
            "&:hover": { border: "none" },
          }}
        >
          Back to Login
        </Button>
        <form onSubmit={handleSubmit}>
          <Typography
            sx={{
              fontWeight: "bolder",
              mb: 3,
              fontSize: "1.5rem",
              color: Colors.text.default,
              fontSmoothing: "antialiased",
            }}
          >
            {isForgotEmail
              ? "Retrieve Your Registered Email"
              : "Reset Your Account Password"}
          </Typography>
          <Controller
            control={form.control}
            name="emailOrPhone"
            render={({ field, fieldState }) => (
              <TextInput
                fullWidth
                label={
                  isForgotEmail
                    ? "Provide your recovery email or registered phone number"
                    : "Please enter your registered email address"
                }
                value={field.value ?? ""}
                onChange={field.onChange}
                error={fieldState.error?.message}
                placeholder="e.g. johndoe@example.com"
                type="text"
                autoComplete="email"
                required
              />
            )}
          />

          <Button
            disabled={!form.formState.isValid || isSubmitting}
            type="submit"
            variant="filled"
            sx={{ fontWeight: "bold", mt: 3, mb: 1, width: "100%" }}
          >
            {isSubmitting && form.formState.isValid ? (
              <LoadingIndicator variant="button" text="Sending" />
            ) : (
              "Send"
            )}
            {!isSubmitting && (
              <ArrowForwardIcon sx={{ height: "1.3rem", width: "auto" }} />
            )}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default RecoveryPage;
