import { useMemo, useState } from "react";
import { Box, IconButton, InputAdornment, Typography } from "@mui/material";
import { Colors } from "../theme";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "../features/menu/components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm, Controller } from "react-hook-form";
import TextInput from "../features/menu/components/TextInput";
import { emailSchema } from "../features/menu/validations/email.validation";
import { checkPasswordSchema } from "../features/menu/validations/password.validation";
import { checkEmail, login } from "../services/auth.service";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { setCredentials } from "../store/authSlice";
import { useAppDispatch } from "../store/hooks/cartHooks";
import { useSnackbar } from "notistack";
import SignUpPage from "./SignUpPage";

type LoginForm = {
  email: string;
  password?: string;
};

type AuthStep = "email" | "password" | "signup";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [authStep, setAuthStep] = useState<AuthStep>("email");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordStep = authStep === "password";

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const schema = useMemo(
    () =>
      z.object({
        email: emailSchema,
        password: isPasswordStep
          ? checkPasswordSchema
          : checkPasswordSchema.optional(),
      }),
    [isPasswordStep],
  );

  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (email: string, password?: string) => {
    if (!password) {
      return;
    }

    const loginResponse = await login({ email, password });

    if (loginResponse.type === "SUCCESS" && loginResponse.successResponse) {
      const { user } = loginResponse.successResponse;

      dispatch(
        setCredentials({
          accessToken: loginResponse.successResponse.accessToken,
          refreshToken: loginResponse.successResponse.refreshToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            restaurantId: user.restaurantId,
          },
        }),
      );

      localStorage.removeItem("existingUser");

      enqueueSnackbar("Logged In!", { variant: "success" });

      const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");
      if (redirectAfterLogin) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectAfterLogin);
      } else if (user.role === "platform_admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "restaurant_admin" && user.restaurantId) {
        navigate("/restaurant/dashboard");
      } else {
        navigate("/");
      }
    } else if (loginResponse.type === "INVALID") {
      enqueueSnackbar("Invalid Credentials", { variant: "error" });
    } else {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    const { email, password } = values;

    if (isPasswordStep) {
      await handleLogin(email, password);
      return;
    }

    const checkEmailResponse = await checkEmail({ email });

    if (checkEmailResponse.type === "EXISTING") {
      setVerifiedEmail(email);
      setAuthStep("password");
      globalThis.setTimeout(() => form.setFocus("password"), 0);
    } else if (checkEmailResponse.type === "NEW") {
      setVerifiedEmail(email);
      setAuthStep("signup");
      return;
    } else {
      enqueueSnackbar("Something went wrong.", { variant: "error" });
      return;
    }
  });

  if (authStep === "signup") {
    return <SignUpPage initialEmail={verifiedEmail} />;
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
      <Box>
        <Button
          variant="border"
          onClick={() => navigate("/account")}
          PrefixComponent={<ArrowBackIcon sx={{ height: "1.3rem" }} />}
          sx={{
            border: "none",
            color: Colors.background.brand,
            fontSize: "1rem",
            fontWeight: "normal",
            borderRadius: "150px",
            mb: 3,
            left: "-200px",
            "&:hover": {
              border: "none",
            },
          }}
        >
          Back
        </Button>
      </Box>
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
            {isPasswordStep ? "Log In" : "Log In or Sign Up"}
          </Typography>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <TextInput
                fullWidth
                label="Email address"
                value={field.value ?? ""}
                onChange={field.onChange}
                error={fieldState.error?.message}
                placeholder="e.g. name@example.com"
                type="email"
                autoComplete="email"
                required
                disabled={isPasswordStep}
              />
            )}
          />

          {isPasswordStep && (
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <TextInput
                  fullWidth
                  label="Password"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  placeholder="Please enter the password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="password"
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
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
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
          )}

          <Button
            disabled={!form.formState.isValid}
            type="submit"
            variant="filled"
            sx={{
              fontWeight: "bold",
              mt: 2,
              mb: 1,
              width: "100%",
            }}
          >
            {isPasswordStep ? "Login" : "Continue"}
          </Button>
          <Button
            type="button"
            onClick={() =>
              navigate("/account/recovery", {
                state: {
                  type: isPasswordStep ? "forgotPassword" : "forgotEmail",
                },
              })
            }
            variant="border"
            sx={{
              width: "100%",
              color: Colors.background.brand,
            }}
          >
            {isPasswordStep ? "Forgot Password?" : "Forgot Email?"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
