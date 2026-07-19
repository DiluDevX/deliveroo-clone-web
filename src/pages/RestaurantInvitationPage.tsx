import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Card, Chip, CircularProgress, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import Button from "../features/menu/components/Button";
import TextInput from "../features/menu/components/TextInput";
import { createPasswordSchema } from "../features/menu/validations/password.validation";
import { checkAuthStatus } from "../services/auth.service";
import {
  acceptRestaurantInvitation,
  getRestaurantInvitationPreview,
} from "../services/restaurant-team.service";
import { setCredentials } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks/cartHooks";
import { Colors } from "../theme";
import type { RestaurantInvitationPreview } from "../types/dto/restaurant-team.dto";
import type { RestaurantUserRole } from "../types/user.types";
import { getApiErrorMessage } from "../utils/api-error";
import { showErrorSnackbar, showSuccessSnackbar } from "../utils/notifications";

type InvitationFormValues = {
  firstName?: string;
  lastName?: string;
  password: string;
};

const roleLabels: Record<RestaurantUserRole, string> = {
  super_admin: "Restaurant owner",
  admin: "Restaurant admin",
  finance: "Finance",
  employee: "Restaurant employee",
};

const RestaurantInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const currentUser = useAppSelector((state) => state.auth.user);
  const token = searchParams.get("token");
  const [invitation, setInvitation] =
    useState<RestaurantInvitationPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);

  const formSchema = useMemo(
    () =>
      z
        .object({
          firstName: z.string().trim().max(100).optional(),
          lastName: z.string().trim().max(100).optional(),
          password: createPasswordSchema,
        })
        .superRefine((values, context) => {
          if (!invitation?.existingUser && !values.firstName) {
            context.addIssue({
              code: "custom",
              message: "First name is required",
              path: ["firstName"],
            });
          }
          if (!invitation?.existingUser && !values.lastName) {
            context.addIssue({
              code: "custom",
              message: "Last name is required",
              path: ["lastName"],
            });
          }
        }),
    [invitation?.existingUser],
  );

  const form = useForm<InvitationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", lastName: "", password: "" },
    mode: "onChange",
  });

  useEffect(() => {
    let isActive = true;

    const loadInvitation = async () => {
      if (!token) {
        setLoadError("This restaurant invitation link is incomplete.");
        setIsLoading(false);
        return;
      }

      try {
        const preview = await getRestaurantInvitationPreview(token);
        if (isActive) setInvitation(preview);
      } catch (error) {
        if (isActive) {
          setLoadError(
            getApiErrorMessage(
              error,
              "This restaurant invitation is invalid or has expired.",
            ),
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadInvitation();
    return () => {
      isActive = false;
    };
  }, [token]);

  const submitInvitation = form.handleSubmit(async (values) => {
    if (!token || !invitation) return;

    try {
      const payload = invitation.existingUser
        ? { password: values.password }
        : values;

      await acceptRestaurantInvitation(token, payload);

      const isMatchingAuthenticatedUser =
        isAuthenticated &&
        currentUser?.email.toLowerCase() === invitation.email.toLowerCase();

      if (isMatchingAuthenticatedUser) {
        const authStatus = await checkAuthStatus();
        if (authStatus && typeof authStatus !== "boolean") {
          dispatch(setCredentials({ user: authStatus.user }));
          showSuccessSnackbar("Restaurant invitation accepted");
          navigate("/restaurant/dashboard", { replace: true });
          return;
        }
      }

      setIsAccepted(true);
      showSuccessSnackbar("Restaurant invitation accepted");
    } catch (error) {
      showErrorSnackbar(
        getApiErrorMessage(error, "Failed to accept restaurant invitation"),
      );
    }
  });

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "65vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "65vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: { xs: 5, md: 8 },
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 520,
          p: { xs: 3, sm: 4 },
          border: `1px solid ${Colors.border.default}`,
          bgcolor: Colors.background.light,
        }}
      >
        {loadError ? (
          <>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5 }}>
              Invitation unavailable
            </Typography>
            <Typography sx={{ color: Colors.text.lighter, mb: 3 }}>
              {loadError}
            </Typography>
            <Button
              variant="filled"
              onClick={() => navigate("/")}
              sx={{ width: "100%", fontWeight: 800 }}
            >
              Return home
            </Button>
          </>
        ) : isAccepted ? (
          <>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5 }}>
              You&apos;re on the team
            </Typography>
            <Typography sx={{ color: Colors.text.lighter, mb: 3 }}>
              Sign in with {invitation?.email} to open the restaurant dashboard.
            </Typography>
            <Button
              variant="filled"
              onClick={() => navigate("/account/login", { replace: true })}
              sx={{ width: "100%", fontWeight: 800 }}
            >
              Continue to login
            </Button>
          </>
        ) : invitation ? (
          <>
            <Chip
              label={roleLabels[invitation.role]}
              sx={{ mb: 2, fontWeight: 800 }}
            />
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5 }}>
              Join the restaurant team
            </Typography>
            <Typography sx={{ color: Colors.text.lighter, mb: 3 }}>
              This invitation is for <strong>{invitation.email}</strong>. For
              security, confirm the account password before joining.
            </Typography>

            <Box
              component="form"
              onSubmit={(event) => void submitInvitation(event)}
            >
              {!invitation.existingUser && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: { sm: 2 },
                  }}
                >
                  <Controller
                    control={form.control}
                    name="firstName"
                    render={({ field, fieldState }) => (
                      <TextInput
                        {...field}
                        value={field.value ?? ""}
                        label="First name"
                        autoComplete="given-name"
                        fullWidth
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="lastName"
                    render={({ field, fieldState }) => (
                      <TextInput
                        {...field}
                        value={field.value ?? ""}
                        label="Last name"
                        autoComplete="family-name"
                        fullWidth
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </Box>
              )}
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label={
                      invitation.existingUser
                        ? "Current account password"
                        : "Create a password"
                    }
                    type="password"
                    autoComplete={
                      invitation.existingUser
                        ? "current-password"
                        : "new-password"
                    }
                    fullWidth
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Button
                type="submit"
                variant="filled"
                disabled={form.formState.isSubmitting}
                sx={{ width: "100%", mt: 1, fontWeight: 800 }}
              >
                {form.formState.isSubmitting
                  ? "Accepting invitation..."
                  : "Accept invitation"}
              </Button>
            </Box>
          </>
        ) : null}
      </Card>
    </Box>
  );
};

export default RestaurantInvitationPage;
