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
import { useSnackbar } from "notistack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { setCredentials } from "../store/authSlice";
import { useAppDispatch } from "../store/hooks/cartHooks";
import { verifyApiKey } from "../services/admin.service";
import { setAdminStatus } from "../store/adminSlice";

type LoginForm = {
  email: string;
  password?: string;
  apiKey?: string;
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [existingUser, setExistingUser] = useState(false);
  const [showApiKeyField, setShowApiKeyField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        password: existingUser
          ? checkPasswordSchema
          : checkPasswordSchema.optional(),
        apiKey:
          existingUser && showApiKeyField
            ? z.string().min(1, "API Key is required")
            : z.string().optional(),
      }),
    [existingUser, showApiKeyField],
  );

  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const { email, password, apiKey } = values;

    const checkEmailResponse = await checkEmail({ email });

    if (checkEmailResponse.type === "EXISTING") {
      setExistingUser(true);
    } else if (checkEmailResponse.type === "NEW") {
      return navigate(`/Account/SignUp?email=${encodeURIComponent(email)}`);
    } else {
      enqueueSnackbar({ variant: "error", message: "Something Went Wrong" });
      return;
    }
    if (email && password && !showApiKeyField) {
      const loginResponse = await login({ email, password });

      if (
        loginResponse.type === "SUCCESS" &&
        loginResponse.successResponse?.user.role === "platform_admin"
      ) {
        setShowApiKeyField(true);
        return;
      }

      if (loginResponse.type === "SUCCESS" && loginResponse.successResponse) {
        dispatch(
          setCredentials({
            user: {
              id: loginResponse.successResponse.user.id,
              orderCount: loginResponse.successResponse.user.orderCount ?? 0,
              status: loginResponse.successResponse.user.status,
              email: loginResponse.successResponse.user.email,
              firstName: loginResponse.successResponse.user.firstName,
              lastName: loginResponse.successResponse.user.lastName,
              phone: loginResponse.successResponse.user.phone,
              role: loginResponse.successResponse.user.role,
              createdAt: loginResponse.successResponse.user.createdAt,
              updatedAt: loginResponse.successResponse.user.updatedAt,
            },
          }),
        );

        // Check for redirect after login
        const redirectPath = sessionStorage.getItem("redirectAfterLogin");
        if (redirectPath) {
          sessionStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath);
        } else {
          navigate("/");
        }
      } else if (loginResponse.type === "INVALID") {
        enqueueSnackbar({ variant: "error", message: "Invalid Credentials" });
      } else {
        enqueueSnackbar({ variant: "error", message: "Something Went Wrong" });
      }
    } else if (showApiKeyField && apiKey && password && email) {
      try {
        console.log(email, password, apiKey);
        const loginResponse = await verifyApiKey(apiKey, email, password);
        console.log("loginResponse", loginResponse);
        if (!loginResponse || !loginResponse.user) {
          throw new Error("Invalid API Key");
        }
        dispatch(setAdminStatus({ isPlatformAdmin: true }));
        dispatch(
          setCredentials({
            user: {
              id: loginResponse.user.id,
              orderCount: loginResponse.user.orderCount ?? 0,
              status: loginResponse.user.status,
              email: loginResponse.user.email,
              firstName: loginResponse.user.firstName,
              lastName: loginResponse.user.lastName,
              phone: loginResponse.user.phone,
              role: loginResponse.user.role,
              createdAt: loginResponse.user.createdAt,
              updatedAt: loginResponse.user.updatedAt,
            },
          }),
        );

        navigate("/");
      } catch (error) {
        console.error("Error verifying API key", error);
        enqueueSnackbar({
          variant: "error",
          message: "Invalid API Key",
        });
      }
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
      <Box>
        <Button
          onClick={() => navigate("/Account")}
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
            Log In
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
                disabled={existingUser}
              />
            )}
          />

          {existingUser && (
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

          {showApiKeyField && existingUser && (
            <Controller
              control={form.control}
              name="apiKey"
              render={({ field, fieldState }) => (
                <TextInput
                  fullWidth
                  label="API Key"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  placeholder="e.g. api-key-here"
                  type="text"
                  autoComplete="off"
                  required
                  disabled={!existingUser || !showApiKeyField}
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
            {existingUser && !showApiKeyField ? "Login" : "Continue"}
          </Button>
          {existingUser && !showApiKeyField && (
            <Button
              type="button"
              onClick={() =>
                navigate("/account/recovery", {
                  state: {
                    type: existingUser ? "forgotPassword" : "forgotEmail",
                  },
                })
              }
              variant="border"
              sx={{
                width: "100%",
                color: Colors.background.brand,
              }}
            >
              {existingUser ? "Forgot Password?" : "Forgot Email?"}
            </Button>
          )}
        </form>
      </Box>
    </Box>
  );
}
