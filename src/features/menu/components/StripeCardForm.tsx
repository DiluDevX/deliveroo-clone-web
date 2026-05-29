import {
  Box,
  Card,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Colors } from "../../../theme/colors";
import { UserPaymentMethod } from "../../../types/payment.types";
import Button from "./Button";

interface StripeCardFormProps {
  clientSecret: string;
  onPaymentSuccess: () => boolean | Promise<boolean>;
  onPaymentError: (error: string) => void;
  totalAmount: number;
  savedPaymentMethods?: UserPaymentMethod[];
}

export const StripeCardForm = ({
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  totalAmount,
  savedPaymentMethods = [],
}: StripeCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const defaultPaymentMethod = savedPaymentMethods.find(
    (paymentMethod) => paymentMethod.isDefault,
  );
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(
    defaultPaymentMethod?.id ?? "new",
  );
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (savedPaymentMethods.length === 0) {
      setSelectedPaymentMethodId("new");
      return;
    }

    setSelectedPaymentMethodId((currentValue) => {
      const hasCurrentValue = savedPaymentMethods.some(
        (paymentMethod) => paymentMethod.id === currentValue,
      );

      if (currentValue === "new" || hasCurrentValue) {
        return currentValue;
      }

      return defaultPaymentMethod?.id ?? savedPaymentMethods[0].id;
    });
  }, [defaultPaymentMethod?.id, savedPaymentMethods]);

  const selectedPaymentMethod = savedPaymentMethods.find(
    (paymentMethod) => paymentMethod.id === selectedPaymentMethodId,
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe) {
      onPaymentError("Stripe is not loaded. Please try again.");
      return;
    }

    setIsConfirming(true);
    let shouldStayDisabled = false;

    try {
      if (selectedPaymentMethod) {
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: selectedPaymentMethod.providerPaymentMethodId,
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

        const finalized = await onPaymentSuccess();
        if (finalized) {
          shouldStayDisabled = true;
          setIsRedirecting(true);
        }
        return;
      }

      if (!elements) {
        onPaymentError("Payment form is still loading.");
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

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

      const finalized = await onPaymentSuccess();
      if (finalized) {
        shouldStayDisabled = true;
        setIsRedirecting(true);
      }
    } catch (err) {
      onPaymentError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      if (!shouldStayDisabled) {
        setIsConfirming(false);
      }
    }
  };

  const isPaymentSubmitting = isConfirming || isRedirecting;

  return (
    <Card
      sx={{
        p: { xs: 0, sm: 3 },
        borderRadius: { xs: 0, sm: "12px" },
        border: {
          xs: "none",
          sm: `1px solid ${Colors.border.subtle}`,
        },
        boxShadow: "none",
        backgroundColor: Colors.background.light,
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

          {savedPaymentMethods.length > 0 && (
            <RadioGroup
              value={selectedPaymentMethodId}
              onChange={(event) =>
                setSelectedPaymentMethodId(event.target.value)
              }
              sx={{ mb: 2, gap: 1 }}
            >
              {savedPaymentMethods.map((paymentMethod) => (
                <Box
                  key={paymentMethod.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: `1px solid ${Colors.border.subtle}`,
                    borderRadius: 2,
                    px: 1.5,
                    py: 1,
                  }}
                >
                  <FormControlLabel
                    value={paymentMethod.id}
                    control={<Radio />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CreditCardIcon
                          sx={{ color: Colors.text.placeholder, fontSize: 20 }}
                        />
                        <Typography sx={{ fontWeight: 600 }}>
                          {paymentMethod.brand.toUpperCase()} ****
                          {paymentMethod.last4}
                        </Typography>
                        <Typography
                          sx={{
                            color: Colors.text.placeholder,
                            fontSize: "0.85rem",
                          }}
                        >
                          {String(paymentMethod.expMonth).padStart(2, "0")}/
                          {String(paymentMethod.expYear).slice(-2)}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              ))}

              <Box
                sx={{
                  border: `1px solid ${Colors.border.subtle}`,
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                }}
              >
                <FormControlLabel
                  value="new"
                  control={<Radio />}
                  label="Use a new card"
                />
              </Box>
            </RadioGroup>
          )}

          {selectedPaymentMethodId === "new" && (
            <PaymentElement options={{ wallets: { link: "never" } }} />
          )}

          <Typography
            sx={{
              fontSize: "0.75rem",
              color: Colors.text.placeholder,
              mt: 2,
              mb: 2,
            }}
          >
            This is a test payment. Use card{" "}
            <strong>4242 4242 4242 4242</strong>, any future expiry, and any
            3-digit CVC.
          </Typography>
        </Box>

        <Button
          variant="filled"
          type="submit"
          disabled={isPaymentSubmitting || !stripe}
          sx={{
            width: "100%",
            fontWeight: "bold",
            py: 1.5,
            fontSize: "1rem",
            gap: 1,
          }}
        >
          {isPaymentSubmitting ? (
            <>
              <CircularProgress size={18} sx={{ color: "inherit" }} />
              Processing...
            </>
          ) : (
            `Pay £${totalAmount.toFixed(2)}`
          )}
        </Button>
      </form>
    </Card>
  );
};
