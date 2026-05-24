import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Colors } from "../theme/colors";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useForm, Controller } from "react-hook-form";
import TextInput from "../features/menu/components/TextInput";
import Button from "../features/menu/components/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema } from "../features/menu/validations/email.validation";
import {
  checkPasswordSchema,
  createPasswordSchema,
} from "../features/menu/validations/password.validation";
import { checkAuthStatus, login, signup } from "../services/auth.service";
import { setAuthInitialized, setCredentials } from "../store/authSlice";
import { useAppDispatch } from "../store/hooks/cartHooks";
import { fetchCart } from "../store/cartSlice";
import { showErrorSnackbar, showSuccessSnackbar } from "../utils/notifications";

type SignUpForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
};

type SignUpPageProps = {
  initialEmail?: string;
  initialFirstName?: string;
  initialLastName?: string;
};

const SignUpPage = ({
  initialEmail,
  initialFirstName,
  initialLastName,
}: SignUpPageProps) => {
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const schema = z
    .object({
      email: emailSchema,
      password: createPasswordSchema,
      firstName: z.string().min(2).max(20),
      lastName: z.string().min(2).max(20),
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

  const form = useForm<SignUpForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    form.setValue("email", initialEmail ?? searchParams.get("email") ?? "", {
      shouldValidate: true,
    });
    form.setValue(
      "firstName",
      initialFirstName ?? searchParams.get("firstName") ?? "",
      { shouldValidate: true },
    );
    form.setValue(
      "lastName",
      initialLastName ?? searchParams.get("lastName") ?? "",
      { shouldValidate: true },
    );
  }, [form, initialEmail, initialFirstName, initialLastName, searchParams]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const { email, password, firstName, lastName } = values;
    const response = await signup({ email, password, firstName, lastName });

    if (response.type === "CONFLICT") {
      showErrorSnackbar("User Already Exists. Please Login.");
    } else if (response.type === "SUCCESS" && response.successResponse) {
      const loginResponse = await login({ email, password });

      if (loginResponse.type !== "SUCCESS" || !loginResponse.successResponse) {
        showSuccessSnackbar("Account created successfully. Please log in.");
        navigate("/account/login");
        return;
      }

      const createdUser = response.successResponse;
      const loginUser = loginResponse.successResponse.user;

      dispatch(
        setCredentials({
          accessToken: loginResponse.successResponse.accessToken,
          refreshToken: loginResponse.successResponse.refreshToken,
          user: {
            id: createdUser.id ?? loginUser.id,
            email: createdUser.email,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            phone: createdUser.phone ?? loginUser.phone,
            role: createdUser.role ?? loginUser.role,
            restaurantId: createdUser.restaurantId ?? loginUser.restaurantId,
          },
        }),
      );
      dispatch(setAuthInitialized(true));

      const authStatus = await checkAuthStatus();
      if (authStatus && typeof authStatus !== "boolean") {
        dispatch(setCredentials({ user: authStatus.user }));
      }

      await dispatch(fetchCart());

      showSuccessSnackbar("Account created successfully!");

      const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");
      if (redirectAfterLogin) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectAfterLogin);
      } else {
        navigate("/");
      }
    } else {
      showErrorSnackbar("Something Went Wrong");
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
            Sign Up
          </Typography>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                fullWidth
                label="Email address"
                error={fieldState.error?.message}
                placeholder="e.g. name@example.com"
                type="email"
                autoComplete="email"
                required
                disabled
              />
            )}
          />

          <Controller
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                fullWidth
                label="First Name"
                error={fieldState.error?.message}
                placeholder="John"
                type="firstName"
                autoComplete="given-name"
                required
              />
            )}
          />
          <Controller
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                fullWidth
                label="Last Name"
                error={fieldState.error?.message}
                placeholder="Doe"
                type="lastName"
                autoComplete="family-name"
                required
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
            disabled={!form.formState.isValid || !checked}
            type="submit"
            variant="filled"
            sx={{
              fontWeight: "bold",
              mt: 2,
              mb: 1,
              width: "100%",
            }}
          >
            Create Account
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default SignUpPage;
