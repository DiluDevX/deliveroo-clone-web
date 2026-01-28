import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TextInput from "../features/menu/components/TextInput";
import { Colors, Svgs } from "../theme";
import Button from "../features/menu/components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { emailSchema } from "../features/menu/validations/email.validation";
import {
  createPasswordSchema,
  checkPasswordSchema,
} from "../features/menu/validations/password.validation";
import { useEffect, useState } from "react";
import LoadingIndicator from "../features/menu/components/LoadingIndicator";
import { resetUserPassword } from "../services/auth.service";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { enqueueSnackbar } from "notistack";

interface ResetPasswordForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const resetPasswordSchema = z
  .object({
    email: emailSchema,
    password: createPasswordSchema,
    confirmPassword: checkPasswordSchema,
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

const ResetPasswordPage = () => {
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!token) {
        setIsLoading(false);
      } else setIsValidToken(true);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [form, token]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      if (!token) return;
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const UpdatedPasswordResponse = await resetUserPassword({
        token: token,
        email: values.email,
        password: values.confirmPassword,
      });
      if (UpdatedPasswordResponse) {
        enqueueSnackbar("Password updated successfully", {
          variant: "success",
          preventDuplicate: true,
          autoHideDuration: 1000,
        });
        navigate("/account/login");
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong", {
        variant: "error",
        preventDuplicate: true,
        autoHideDuration: 1500,
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  });
  if (isLoading) {
    return <LoadingIndicator text="Please wait..." />;
  }

  if (!isValidToken) {
    return (
      <Box
        textAlign="center"
        mt={10}
        mb={5}
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <img
          src={Svgs.ExpiredLink}
          alt="Expired Link"
          style={{ width: "300px", height: "auto" }}
        />
        <Typography color="error" mt={3} fontWeight="bold">
          Oops! This reset link is invalid or has expired.
        </Typography>
        <Typography color="textSecondary">
          Please request a new password reset link.
        </Typography>
        <Button
          variant="border"
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
          onClick={() => navigate("/account/recovery")}
        >
          Request New Link
          <ArrowForwardIcon sx={{ ml: 1 }} />
        </Button>
      </Box>
    );
  }

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
      <Box></Box>
      <Box sx={{ width: "100%", minWidth: "200px", maxWidth: "400px" }}>
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
            Reset Password
          </Typography>
          <Controller
            control={form.control}
            name="email"
            shouldUnregister={true}
            render={({ fieldState }) => (
              <TextInput
                {...form.register("email")}
                aria-readonly
                fullWidth
                label="Email address"
                error={fieldState.error?.message}
                placeholder="e.g. name@example.com"
                type="email"
                autoComplete="email"
                disabled
              />
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                fullWidth
                label="Password"
                error={fieldState.error?.message}
                placeholder="Please enter a password"
                type="password"
                autoComplete="new-password"
                required
              />
            )}
          />

          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                fullWidth
                label="Confirm Password"
                error={fieldState.error?.message}
                placeholder="Confirm password"
                type="password"
                autoComplete="new-password"
                required
              />
            )}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  style={{ color: Colors.background.brand }}
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
              }
              label={
                <Typography
                  sx={{ fontWeight: "normal", color: Colors.text.default }}
                >
                  I Agree to{" "}
                  <Link
                    to={"https://deliveroo.co.uk/legal"}
                    style={{
                      color: Colors.background.brand,
                      textDecoration: "none",
                    }}
                  >
                    Terms and conditions
                  </Link>
                </Typography>
              }
            />
          </FormGroup>

          <Button
            disabled={!form.formState.isValid || !checked || isSubmitting}
            type="submit"
            variant="filled"
            sx={{ fontWeight: "bold", mt: 3, mb: 1, width: "100%" }}
          >
            {isSubmitting && form.formState.isValid ? (
              <LoadingIndicator variant="button" text="Please wait" />
            ) : (
              "Done"
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

export default ResetPasswordPage;
