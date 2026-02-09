import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import TextInput from "../features/menu/components/TextInput";
import { Colors } from "../theme";
import Button from "../features/menu/components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HowToRegIcon from "@mui/icons-material/HowToReg";

type AccountCompletionForm = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod?: string;
};
const AccountCompletionPage = () => {
  const [step, setStep] = useState(1);
  const [checked, setChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const schema = z.object({
    firstName: z.string().min(2).max(8).toUpperCase(),
    lastName: z.string().min(2).max(10).toUpperCase(),
    phone: z
      .string()
      .min(10)
      .max(10)
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

    address: z.string().min(5).max(30),
    city: z.string().min(2).max(10),
    postalCode: z.string().min(2).max(10),
    paymentMethod: z.string().min(2).max(10).optional(),
  });

  const form = useForm<AccountCompletionForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const nextStep = () => {
    setStep(step + 1);
  };
  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    console.log(values);
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
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: Colors.text.default, mb: 4 }}
              >
                Personal Details
              </Typography>
              <Box sx={{ display: "grid", gap: 2 }}>
                <Controller
                  control={form.control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <TextInput
                      label="First Name"
                      {...field}
                      error={fieldState.error?.message}
                      placeholder="Edward"
                      type="name"
                      autoComplete="given-name"
                      required
                      sx={{ width: "100%" }}
                    />
                  )}
                />

                <Controller
                  disabled={
                    !form.watch("firstName") ||
                    !!form.formState.errors.firstName
                  }
                  control={form.control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <TextInput
                      label="Last Name"
                      {...field}
                      error={fieldState.error?.message}
                      placeholder="Stevenson"
                      type="name"
                      autoComplete="family-name"
                      required
                      sx={{ width: "100%" }}
                    />
                  )}
                />

                <Controller
                  disabled={
                    !form.watch("firstName") ||
                    (!!form.formState.errors.firstName &&
                      !form.watch("lastName")) ||
                    !!form.formState.errors.lastName
                  }
                  control={form.control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <TextInput
                      label="Contact Number"
                      {...field}
                      error={fieldState.error?.message}
                      placeholder="0761234567"
                      type="tel"
                      autoComplete="tel"
                      required
                      sx={{ width: "100%" }}
                    />
                  )}
                />
              </Box>
            </>
          )}

          {step === 2 && (
            <>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: Colors.text.default, mb: 4 }}
              >
                Delivery Details
              </Typography>
              <Controller
                control={form.control}
                name="address"
                render={({ field, fieldState }) => (
                  <TextInput
                    label="Address"
                    {...field}
                    error={fieldState.error?.message}
                    placeholder="e.g. 123 Main Street"
                    type="address"
                    autoComplete="address"
                    required
                  />
                )}
              />
              <Controller
                control={form.control}
                name="city"
                render={({ field, fieldState }) => (
                  <TextInput
                    label="City"
                    {...field}
                    error={fieldState.error?.message}
                    placeholder="e.g. London"
                    type="city"
                    autoComplete="city"
                    required
                  />
                )}
              />
              <Controller
                control={form.control}
                name="postalCode"
                render={({ field, fieldState }) => (
                  <TextInput
                    label="Postal code"
                    {...field}
                    error={fieldState.error?.message}
                    placeholder="e.g. SW1A 1AA"
                    type="postalCode"
                    autoComplete="postalCode"
                    required
                  />
                )}
              />
            </>
          )}

          {step === 3 && (
            <>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  textAlign: "left",
                  mb: 1,
                  color: Colors.text.default,
                }}
              >
                Select Payment Method
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Preferred method with secure transactions
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 2,
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {[
                  {
                    name: "Visa",
                    icon: "https://static-00.iconduck.com/assets.00/visa-icon-2048x1313-o6hi8q5l.png",
                  },
                  {
                    name: "MasterCard",
                    icon: "https://pngimg.com/d/mastercard_PNG23.png",
                  },
                  {
                    name: "PayPal",
                    icon: "https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_1280.png",
                  },
                  {
                    name: "Apple Pay",
                    icon: "https://download.logo.wine/logo/Apple_Pay/Apple_Pay-Logo.wine.png",
                  },
                  {
                    name: "Stripe",
                    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968382.png",
                  },
                ].map((method) => (
                  <Button
                    key={method.name}
                    onClick={() => setPaymentMethod(method.name)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100px",
                      borderRadius: "12px",
                      border:
                        paymentMethod === method.name
                          ? `2px solid ${Colors.background.brand}`
                          : "1px solid #ddd",
                      backgroundColor:
                        paymentMethod === method.name
                          ? Colors.background.brandHover
                          : "white",
                      boxShadow:
                        paymentMethod === method.name
                          ? "0px 6px 12px rgba(0, 0, 0, 0.15)"
                          : "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      transition: "0.3s",
                    }}
                  >
                    <img
                      src={method.icon}
                      alt={method.name}
                      style={{
                        width: "45px",
                        height: "auto",
                        marginBottom: "8px",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: Colors.text.default,
                      }}
                    >
                      {method.name}
                    </Typography>
                  </Button>
                ))}
              </Box>
            </>
          )}

          {step === 4 && (
            <Box sx={{ p: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  color: Colors.text.default,
                  textWrap: "wrap",
                }}
              >
                Terms & Conditions Agreement
              </Typography>
              <Typography variant="body2" sx={{ mb: 4 }}>
                Please review and accept our{" "}
                <a
                  href={"https://deliveroo.co.uk/legal"}
                  style={{
                    color: Colors.background.brand,
                    textDecoration: "none",
                  }}
                >
                  Terms and Conditions
                </a>{" "}
                before proceeding. This includes our policies on privacy,
                security, and refunds.
              </Typography>
              <FormGroup sx={{ mb: 1 }}>
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
                      sx={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        textWrap: "nowrap",
                        color: Colors.text.default,
                      }}
                    >
                      I have read and agree to the Terms and Conditions.
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>
          )}
        </form>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 22,
            mt: 2,
          }}
        >
          {step > 1 && (
            <Button
              type="button"
              onClick={prevStep}
              variant="filled"
              sx={{
                fontWeight: "bold",
                fontSmoothing: "antialiased",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                mr: "auto",
                mt: 2,
                mb: 1,
                width: "100%",
              }}
            >
              <ArrowBackIcon
                sx={{ height: "1.5rem", width: "1.5rem", ml: -2 }}
              />
              Prev
            </Button>
          )}

          {step >= 1 && (
            <Button
              disabled={
                (step === 1 &&
                  (!form.watch("firstName") ||
                    !form.watch("lastName") ||
                    !form.watch("phone") ||
                    !!form.formState.errors.firstName ||
                    !!form.formState.errors.lastName ||
                    !!form.formState.errors.phone)) ||
                (step === 2 &&
                  (!form.watch("phone") ||
                    !form.watch("address") ||
                    !form.watch("city") ||
                    !form.watch("postalCode") ||
                    !!form.formState.errors.phone ||
                    !!form.formState.errors.address ||
                    !!form.formState.errors.city ||
                    !!form.formState.errors.postalCode)) ||
                (step === 3 &&
                  (!form.watch("address") ||
                    !!form.formState.errors.address)) ||
                (step === 4 &&
                  (!form.watch("paymentMethod") ||
                    !!form.formState.errors.paymentMethod))
              }
              type="button"
              onClick={nextStep}
              variant="filled"
              sx={{
                display: step === 4 ? "none" : "flex",
                fontWeight: "bold",
                mt: 2,
                mb: 1,
                width: "100%",
                cursor:
                  (step === 1 &&
                    (!form.watch("firstName") ||
                      !form.watch("lastName") ||
                      !!form.formState.errors.firstName ||
                      !!form.formState.errors.lastName)) ||
                  (step === 2 &&
                    (!form.watch("phone") ||
                      !form.watch("address") ||
                      !form.watch("city") ||
                      !form.watch("postalCode") ||
                      !!form.formState.errors.phone ||
                      !!form.formState.errors.address ||
                      !!form.formState.errors.city ||
                      !!form.formState.errors.postalCode)) ||
                  (step === 3 &&
                    (!form.watch("address") ||
                      !!form.formState.errors.address)) ||
                  (step === 4 &&
                    (!form.watch("paymentMethod") ||
                      !!form.formState.errors.paymentMethod))
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Next
              <ArrowForwardIcon
                sx={{
                  height: "auto",
                  width: "1.5rem",
                  fontSmoothing: "antialiased",
                }}
              />
            </Button>
          )}
          {step === 4 && (
            <Button
              disabled={!checked}
              onClick={() => {
                handleSubmit();
              }}
              type="submit"
              variant="filled"
              sx={{
                fontWeight: "bold",
                mt: 2,
                mb: 1,
                width: "100%",
              }}
            >
              Finish
              <HowToRegIcon
                sx={{
                  height: "auto",
                  width: "1.5rem",
                  fontSmoothing: "antialiased",
                  ml: 1,
                }}
              />
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AccountCompletionPage;
