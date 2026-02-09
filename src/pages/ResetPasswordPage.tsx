import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useLocation } from "@tanstack/react-router";
import TextInput from "../features/menu/components/TextInput";
import { Colors, Svgs } from "../theme";
import Button from "../features/menu/components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createPasswordSchema,
  checkPasswordSchema,
} from "../features/menu/validations/password.validation";
import { useEffect, useState } from "react";
import LoadingIndicator from "../features/menu/components/LoadingIndicator";
import { resetUserPassword } from "../services/auth.service";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { toast } from "sonner";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const resetPasswordSchema = z
  .object({
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (token) {
        setIsValidToken(true);
        setIsLoading(false);
      } else setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [token]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      if (!token) return;
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const UpdatedPasswordResponse = await resetUserPassword({
        token: token,
        password: values.confirmPassword,
      });
      if (UpdatedPasswordResponse) {
        toast.success("Password updated successfully");
        navigate({ to: "/account/login" });
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  });
  if (isLoading) {
    return <LoadingIndicator />;
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
          onClick={() => navigate({ to: "/account/recovery" })}
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
            name="password"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                fullWidth
                label="Password"
                error={fieldState.error?.message}
                placeholder="Please enter a password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mr: 2 }}>
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
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
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mr: 2 }}>
                        <IconButton
                          aria-label={
                            showConfirmPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
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
                  <a
                    href="https://deliveroo.co.uk/legal"
                    style={{
                      color: Colors.background.brand,
                      textDecoration: "none",
                    }}
                  >
                    Terms and conditions
                  </a>
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
              "Submit"
            )}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
