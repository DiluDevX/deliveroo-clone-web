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

type RecoveryForm = {
  emailOrPhone: string;
};

const RecoveryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isForgotEmail = location.state?.type === "forgotEmail";

  const schema = z.object({
    emailOrPhone: z
      .string()
      .min(1, "Please enter your email or phone number")
      .refine(
        (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{10,15}$/.test(value),
        {
          message: "Enter a valid email or phone number",
        },
      ),
  });

  const form = useForm<RecoveryForm>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      if (isForgotEmail) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Form submitted:", values);
        localStorage.setItem("emailOrPhone", values.emailOrPhone);
        navigate("/account/recovery-confirmation");
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Form submitted:", values);
        localStorage.setItem("emailOrPhone", values.emailOrPhone);
        navigate("/account/recovery-confirmation", {
          state: { type: "passwordReset" },
        });
      }
    } catch (error) {
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
          onClick={() => navigate("/Account")}
          PrefixComponent={<ArrowBackIcon sx={{ height: "1.3rem" }} />}
          sx={{
            border: "none",
            color: Colors.background.brand,
            fontSize: "1rem",
            fontWeight: "normal",
            borderRadius: "150px",
            left: -20,
            mb: 3,

            "&:hover": {
              border: "none",
            },
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
            {isForgotEmail ? "Recover Your Email" : "Reset Your Password"}
          </Typography>
          <Controller
            control={form.control}
            name="emailOrPhone"
            render={({ field, fieldState }) => (
              <TextInput
                fullWidth
                label={
                  isForgotEmail
                    ? "Enter your phone number or recovery email"
                    : "Enter your phone number or email"
                }
                value={field.value ?? ""}
                onChange={field.onChange}
                error={fieldState.error?.message}
                placeholder={
                  isForgotEmail
                    ? "e.g. recovery@example.com or 1234567890"
                    : "e.g. name@example.com or 1234567890"
                }
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
            sx={{
              fontWeight: "bold",
              mt: 3,
              mb: 1,
              width: "100%",
            }}
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
