import { Box, Typography, Card } from "@mui/material";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Colors } from "../../../theme/colors";
import Button from "./Button";
import { useState } from "react";

type StripeElementChange = {
  complete: boolean;
  error?: {
    message?: string;
  };
};

interface StripeCardFormProps {
  clientSecret: string;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
  totalAmount: number;
}

/**
 * Stripe Card Payment Form Component
 * Handles secure card input using Stripe CardElement
 * PCI compliance is handled by Stripe - card data never touches your server
 */
export const StripeCardForm = ({
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  totalAmount,
}: StripeCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isCardholderNameValid = cardholderName.trim().length > 1;
  const isFormComplete =
    isCardholderNameValid &&
    cardNumberComplete &&
    cardExpiryComplete &&
    cardCvcComplete;

  const elementOptions = {
    style: {
      base: {
        fontSize: "1rem",
        color: Colors.text.default,
        "::placeholder": {
          color: Colors.text.placeholder,
        },
      },
      invalid: {
        color: "#dc3545",
      },
    },
    disabled: isConfirming,
  };

  const stripeFieldSx = {
    padding: "10px 12px",
    borderRadius: "8px",
    backgroundColor: isConfirming ? Colors.background.default : "white",
    minHeight: "40px",
    display: "flex",
    alignItems: "center",
    "& .StripeElement": {
      width: "100%",
    },
  };

  const handleElementChange =
    (field: "cardNumber" | "cardExpiry" | "cardCvc") =>
    (event: StripeElementChange) => {
      if (field === "cardNumber") {
        setCardNumberComplete(event.complete);
      }

      if (field === "cardExpiry") {
        setCardExpiryComplete(event.complete);
      }

      if (field === "cardCvc") {
        setCardCvcComplete(event.complete);
      }

      setFieldErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };

        if (event.error?.message) {
          nextErrors[field] = event.error.message;
        } else {
          delete nextErrors[field];
        }

        return nextErrors;
      });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!stripe || !elements) {
      onPaymentError("Stripe is not loaded. Please try again.");
      return;
    }

    if (!cardholderName.trim()) {
      nextErrors.cardholderName = "Please enter the cardholder name";
    } else if (!isCardholderNameValid) {
      nextErrors.cardholderName = "Cardholder name is too short";
    }

    if (!cardNumberComplete) {
      nextErrors.cardNumber = "Please enter a valid card number";
    }

    if (!cardExpiryComplete) {
      nextErrors.cardExpiry = "Please enter a valid expiry date";
    }

    if (!cardCvcComplete) {
      nextErrors.cardCvc = "Please enter a valid CVC";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        ...nextErrors,
      }));
      onPaymentError("Please complete the card details.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      onPaymentError("Card number element not found");
      return;
    }

    setIsConfirming(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: cardholderName,
            },
          },
        },
      );

      if (error) {
        onPaymentError(error.message || "Payment confirmation failed");
        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        onPaymentError(
          `Payment not completed. Status: ${paymentIntent?.status ?? "unknown"}`,
        );
        return;
      }

      onPaymentSuccess();
    } catch (err) {
      onPaymentError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: "12px",
        border: `1px solid ${Colors.border.subtle}`,
        boxShadow: "none",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 2, color: Colors.text.default }}
          >
            Card Details
          </Typography>

          <Box sx={{ mb: 2 }}>
            <label htmlFor="cardholder-name">
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  mb: 0.5,
                  color: Colors.text.default,
                }}
              >
                Cardholder Name
              </Typography>
            </label>
            <input
              id="cardholder-name"
              type="text"
              value={cardholderName}
              onChange={(e) => {
                setCardholderName(e.target.value);
                setFieldErrors((currentErrors) => {
                  const nextErrors = { ...currentErrors };
                  delete nextErrors.cardholderName;
                  return nextErrors;
                });
              }}
              placeholder="John Doe"
              disabled={isConfirming}
              aria-invalid={Boolean(fieldErrors.cardholderName)}
              aria-describedby="cardholder-name-error"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: `1px solid ${Colors.border.subtle}`,
                fontSize: "1rem",
                fontFamily: "inherit",
                boxSizing: "border-box",
                backgroundColor: isConfirming
                  ? Colors.background.default
                  : "white",
              }}
            />
            {fieldErrors.cardholderName && (
              <Typography
                id="cardholder-name-error"
                sx={{ mt: 0.5, fontSize: "0.75rem", color: "#dc3545" }}
              >
                {fieldErrors.cardholderName}
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 2 }}>
            <label htmlFor="card-number-element">
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  mb: 0.5,
                  color: Colors.text.default,
                }}
              >
                Card Number
              </Typography>
            </label>
            <Box
              id="card-number-element"
              sx={{
                ...stripeFieldSx,
                border: `1px solid ${
                  fieldErrors.cardNumber ? "#dc3545" : Colors.border.subtle
                }`,
              }}
            >
              <CardNumberElement
                options={elementOptions}
                onChange={handleElementChange("cardNumber")}
              />
            </Box>
            {fieldErrors.cardNumber && (
              <Typography
                sx={{ mt: 0.5, fontSize: "0.75rem", color: "#dc3545" }}
              >
                {fieldErrors.cardNumber}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                component="label"
                htmlFor="card-expiry-element"
                sx={{
                  display: "block",
                  fontSize: "0.875rem",
                  mb: 0.5,
                  color: Colors.text.default,
                }}
              >
                Expiry Date
              </Typography>
              <Box
                id="card-expiry-element"
                sx={{
                  ...stripeFieldSx,
                  border: `1px solid ${
                    fieldErrors.cardExpiry ? "#dc3545" : Colors.border.subtle
                  }`,
                }}
              >
                <CardExpiryElement
                  options={elementOptions}
                  onChange={handleElementChange("cardExpiry")}
                />
              </Box>
              {fieldErrors.cardExpiry && (
                <Typography
                  sx={{ mt: 0.5, fontSize: "0.75rem", color: "#dc3545" }}
                >
                  {fieldErrors.cardExpiry}
                </Typography>
              )}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                component="label"
                htmlFor="card-cvc-element"
                sx={{
                  display: "block",
                  fontSize: "0.875rem",
                  mb: 0.5,
                  color: Colors.text.default,
                }}
              >
                CVC
              </Typography>
              <Box
                id="card-cvc-element"
                sx={{
                  ...stripeFieldSx,
                  border: `1px solid ${
                    fieldErrors.cardCvc ? "#dc3545" : Colors.border.subtle
                  }`,
                }}
              >
                <CardCvcElement
                  options={elementOptions}
                  onChange={handleElementChange("cardCvc")}
                />
              </Box>
              {fieldErrors.cardCvc && (
                <Typography
                  sx={{ mt: 0.5, fontSize: "0.75rem", color: "#dc3545" }}
                >
                  {fieldErrors.cardCvc}
                </Typography>
              )}
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: "0.75rem",
              color: Colors.text.placeholder,
              mt: 2,
              mb: 2,
            }}
          >
            💳 This is a test payment. Use card:{" "}
            <strong>4242 4242 4242 4242</strong>
            <br />
            Expiry: Any future date | CVC: Any 3 digits
          </Typography>
        </Box>

        <Button
          variant="filled"
          type="submit"
          disabled={isConfirming || !stripe || !isFormComplete}
          sx={{
            width: "100%",
            fontWeight: "bold",
            py: 1.5,
            fontSize: "1rem",
          }}
        >
          {isConfirming ? "Processing..." : `Pay £${totalAmount.toFixed(2)}`}
        </Button>
      </form>
    </Card>
  );
};
