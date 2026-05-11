import { Box, Typography, Card } from "@mui/material";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Colors } from "../../../theme/colors";
import Button from "./Button";
import { useState } from "react";

interface StripeCardFormProps {
  isProcessing: boolean;
  onPaymentSuccess: (clientSecret: string) => void;
  onPaymentError: (error: string) => void;
  totalAmount: number;
}

/**
 * Stripe Card Payment Form Component
 * Handles secure card input using Stripe CardElement
 * PCI compliance is handled by Stripe - card data never touches your server
 */
export const StripeCardForm = ({
  isProcessing,
  onPaymentSuccess,
  onPaymentError,
  totalAmount,
}: StripeCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onPaymentError("Stripe is not loaded. Please try again.");
      return;
    }

    if (!cardholderName.trim()) {
      onPaymentError("Please enter the cardholder name");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPaymentError("Card element not found");
      return;
    }

    try {
      // Create payment method from card details
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardholderName,
        },
      });

      if (error) {
        onPaymentError(error.message || "Card validation failed");
        return;
      }

      // Return payment method ID to parent to send to backend
      if (paymentMethod) {
        onPaymentSuccess(paymentMethod.id);
      }
    } catch (err) {
      onPaymentError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
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
              <Typography sx={{ fontSize: "0.875rem", mb: 0.5, color: Colors.text.default }}>
                Cardholder Name
              </Typography>
            </label>
            <input
              id="cardholder-name"
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
              disabled={isProcessing}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: `1px solid ${Colors.border.subtle}`,
                fontSize: "1rem",
                fontFamily: "inherit",
                boxSizing: "border-box",
                backgroundColor: isProcessing ? Colors.background.default : "white",
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <label htmlFor="card-element">
              <Typography sx={{ fontSize: "0.875rem", mb: 0.5, color: Colors.text.default }}>
                Card Number
              </Typography>
            </label>
            <Box
              id="card-element-container"
              sx={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: `1px solid ${Colors.border.subtle}`,
                backgroundColor: isProcessing ? Colors.background.default : "white",
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardElement
                id="card-element"
                options={{
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
                  disabled: isProcessing,
                }}
              />
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
            💳 This is a test payment. Use card: <strong>4242 4242 4242 4242</strong>
            <br />
            Expiry: Any future date | CVC: Any 3 digits
          </Typography>
        </Box>

        <Button
          variant="filled"
          type="submit"
          disabled={isProcessing || !stripe}
          sx={{
            width: "100%",
            fontWeight: "bold",
            py: 1.5,
            fontSize: "1rem",
          }}
        >
          {isProcessing ? "Processing..." : `Pay £${totalAmount.toFixed(2)}`}
        </Button>
      </form>
    </Card>
  );
};
