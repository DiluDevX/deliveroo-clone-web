import { useMemo, useState } from "react";
import { Box, IconButton, InputAdornment, Typography } from "@mui/material";
import { Colors } from "../theme/colors";
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
import { CheckEmailResponseBodyDTO } from "../types/auth.types";
import { useSnackbar } from "notistack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { setCredentials } from "../store/authSlice";
import { useAppDispatch } from "../store/hooks/cartHooks";

type LoginForm = {
  email: string;
  password?: string;
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [existingUser, setExistingUser] = useState<CheckEmailResponseBodyDTO>();
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
      }),
    [existingUser],
  );

  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const { email, password } = values;
    console.log("Form submitted with:", { email, password }); // Debug log

    if (!password) {
      const checkEmailResponse = await checkEmail({ email });

      if (checkEmailResponse.type === "EXISTING") {
        localStorage.setItem("existingUser", true.toString());
        setExistingUser(checkEmailResponse.existingUser);
      } else if (checkEmailResponse.type === "NEW") {
        navigate(`/Account/SignUp?email=${encodeURIComponent(email)}`);
      } else {
        enqueueSnackbar({ variant: "error", message: "Something Went Wrong" });
      }
    } else {
      const loginResponse = await login({ email, password });
      console.log("Login response:", loginResponse); // Debug log

      if (loginResponse.type === "SUCCESS" && loginResponse.successResponse) {
        console.log("Login successful, dispatching credentials..."); // Debug log
        dispatch(
          setCredentials({
            user: {
              email: loginResponse.successResponse.user.email,
              firstName: loginResponse.successResponse.user.firstName,
              lastName: loginResponse.successResponse.user.lastName,
              phone: loginResponse.successResponse.user.phone,
              role: loginResponse.successResponse.user.role,
            },
          }),
        );

        // The server should set the session via HttpOnly cookie. Do not persist tokens in client JS.
        // If you must fallback to client storage, ensure comprehensive XSS mitigations and document why.
        localStorage.removeItem("existingUser");

        // Check for redirect after login
        const redirectPath = sessionStorage.getItem("redirectAfterLogin");
        console.log("Navigating to:", redirectPath || "/"); // Debug log
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
            {existingUser ? "Log In" : "Log In or Sign Up"}
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
                disabled={!!existingUser}
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
            {existingUser ? "Login" : "Continue"}
          </Button>

          <Button
            type="button"
            onClick={() =>
              existingUser
                ? navigate("/account/recovery")
                : navigate("/account/recovery", {
                    state: { type: "forgotEmail" },
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
        </form>
      </Box>
    </Box>
  );
}
