import { Box, Typography, Grid, Card, CircularProgress } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { Colors } from "../theme/colors";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../features/menu/components/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAppSelector, useAppDispatch } from "../store/hooks/cartHooks";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {
  createPaymentIntent,
  confirmPayment,
} from "../services/payment.service";
import { checkoutCart } from "../services/order.service";
import { clearCartAndSync } from "../store/cartSlice";
import { stripePromise } from "../config/stripe";
import { StripeCardForm } from "../features/menu/components/StripeCardForm";

type CheckoutData = {
  address?: string;
  city?: string;
  zipCode?: string;
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [progress, setProgress] = useState(50);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const checkoutData = location.state?.checkoutData as CheckoutData | null;
  const deliveryMethod = (location.state?.deliveryMethod || "delivery") as
    | "delivery"
    | "pickup";
  const paymentMethod = (location.state?.paymentMethod || "CARD") as
    | "CARD"
    | "CASH_ON_DELIVERY";
  const restaurantName =
    localStorage.getItem("selected-restaurant-name") || "Restaurant";
  const restaurantAddress =
    localStorage.getItem("selected-restaurant-address") || "";

  const shippingFee = deliveryMethod === "delivery" ? 5.0 : 0;
  const serviceFee = 0.99;
  const discount = 0;
  const total =
    cartItems.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0,
    ) +
    shippingFee +
    serviceFee -
    discount;

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0,
  );

  /**
   * Handle cash on delivery payment
   * Creates order and navigates to confirmation
   */
  const handleCashPayment = async () => {
    if (
      deliveryMethod === "delivery" &&
      (!checkoutData?.address || !checkoutData?.city || !checkoutData?.zipCode)
    ) {
      setError("Missing delivery address");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      setProcessingStep("Creating order...");

      const checkoutRequest = {
        deliveryAddress: {
          line1: checkoutData?.address || "",
          city: checkoutData?.city || "",
          postcode: checkoutData?.zipCode || "",
          country: "UK",
        },
        restaurantName,
        restaurantAddress,
        deliveryFee: shippingFee,
        serviceFee,
        discountAmount: discount,
        paymentMethod: "cash",
      };

      const orderResponse = await checkoutCart(checkoutRequest);

      if (!orderResponse?.orderId) {
        setIsProcessing(false);
        setError("Failed to create order. Please try again.");
        setProcessingStep("");
        return;
      }

      // Order created successfully for cash payment
      dispatch(clearCartAndSync());
      navigate("/order-confirmation", {
        state: {
          orderId: orderResponse.orderNumber,
          orderDetails: {
            subtotal,
            shippingFee,
            serviceFee,
            discount,
            total,
          },
        },
      });
      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setError("An unexpected error occurred. Please try again.");
      setProcessingStep("");
      console.error("Cash payment error:", err);
    }
  };

  /**
   * Handle card payment - creates order and payment intent
   */
  const handleCardPayment = async () => {
    if (
      deliveryMethod === "delivery" &&
      (!checkoutData?.address || !checkoutData?.city || !checkoutData?.zipCode)
    ) {
      setError("Missing delivery address");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      setProcessingStep("Creating order...");

      const checkoutRequest = {
        deliveryAddress: {
          line1: checkoutData?.address || "",
          city: checkoutData?.city || "",
          postcode: checkoutData?.zipCode || "",
          country: "UK",
        },
        restaurantName,
        restaurantAddress,
        deliveryFee: shippingFee,
        serviceFee,
        discountAmount: discount,
        paymentMethod: "card",
      };

      const orderResponse = await checkoutCart(checkoutRequest);

      if (!orderResponse?.orderId) {
        setIsProcessing(false);
        setError("Failed to create order. Please try again.");
        setProcessingStep("");
        return;
      }

      setOrderNumber(orderResponse.orderNumber);

      // Order created, now create payment intent from the server-owned order total
      setProcessingStep("Preparing payment...");

      const paymentIntent = await createPaymentIntent({
        orderId: orderResponse.orderId,
        expectedTotalAmount: total,
      });

      if (
        !paymentIntent?.data?.clientSecret ||
        !paymentIntent?.data?.paymentId
      ) {
        setIsProcessing(false);
        setError("Failed to process payment. Please try again.");
        setProcessingStep("");
        return;
      }

      // Store payment details for StripeCardForm to use
      setPaymentId(paymentIntent.data.paymentId);
      setClientSecret(paymentIntent.data.clientSecret);
      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setError("An unexpected error occurred. Please try again.");
      setProcessingStep("");
      console.error("Card payment setup error:", err);
    }
  };

  const handleStripePaymentSucceeded = async () => {
    if (!paymentId) {
      setError("Payment setup failed. Please try again.");
      return;
    }

    setIsProcessing(true);
    setProcessingStep("Finalizing payment...");

    try {
      const confirmed = await confirmPayment(paymentId);

      if (!confirmed) {
        setIsProcessing(false);
        setError("Payment confirmation failed. Please try again.");
        setProcessingStep("");
        return;
      }

      dispatch(clearCartAndSync());

      navigate("/order-confirmation", {
        state: {
          orderId: orderNumber || "unknown",
          orderDetails: {
            subtotal,
            shippingFee,
            serviceFee,
            discount,
            total,
          },
        },
      });
      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setError("An unexpected error occurred. Please try again.");
      setProcessingStep("");
      console.error("Payment confirmation error:", err);
    }
  };

  return (
    <Box
      sx={{
        mt: 7,
        minHeight: "calc(100vh - 130px)",
        backgroundColor: Colors.background.default,
        py: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          mb: 4,
          px: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon sx={{ color: Colors.background.brand }} />
            <Typography
              sx={{
                color: Colors.text.default,
                display: { xs: "none", sm: "block" },
              }}
            >
              Cart
            </Typography>
          </Box>

          <Box
            sx={{
              width: { xs: "30px", sm: "60px", md: "100px" },
              height: "2px",
              backgroundColor: Colors.background.brand,
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon sx={{ color: Colors.background.brand }} />
            <Typography
              sx={{
                color: Colors.text.default,
                display: { xs: "none", sm: "block" },
              }}
            >
              Review
            </Typography>
          </Box>

          <Box
            sx={{
              width: { xs: "30px", sm: "60px", md: "100px" },
              height: "2px",
              background: `linear-gradient(to right, ${Colors.background.brand} ${progress}%, ${Colors.border.subtle} ${progress}%)`,
              transition: "background 0.1s ease",
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 25,
                height: 25,
                borderRadius: "50%",
                backgroundColor: Colors.background.brand,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: "bold",
                padding: "15px",
              }}
            >
              <CreditCardIcon sx={{ scale: "0.8" }} />
            </Box>
            <Typography
              sx={{
                color: Colors.text.default,
                fontWeight: "bold",
                display: { xs: "none", sm: "block" },
              }}
            >
              Payment
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: 3,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                p: 3,
                borderRadius: "12px",
                border: `1px solid ${Colors.border.subtle}`,
                boxShadow: "none",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 3, color: Colors.text.default }}
              >
                Payment Details
              </Typography>

              {paymentMethod === "CARD" ? (
                <>
                  {clientSecret && paymentId ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripeCardForm
                        clientSecret={clientSecret}
                        isProcessing={isProcessing}
                        onPaymentSuccess={handleStripePaymentSucceeded}
                        onPaymentError={setError}
                        totalAmount={total}
                      />
                    </Elements>
                  ) : (
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: Colors.background.light,
                        borderRadius: "8px",
                        textAlign: "center",
                      }}
                    >
                      <CircularProgress size={30} sx={{ mb: 2 }} />
                      <Typography sx={{ color: Colors.text.default }}>
                        {processingStep || "Preparing payment..."}
                      </Typography>
                    </Box>
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: Colors.background.light,
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ color: Colors.text.default, mb: 1 }}>
                    You will pay in cash when your order is delivered.
                  </Typography>
                  <Typography
                    sx={{ color: Colors.text.placeholder, fontSize: "0.9rem" }}
                  >
                    Please ensure you have the exact amount ready.
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card
              sx={{
                p: 3,
                borderRadius: "12px",
                border: `1px solid ${Colors.border.subtle}`,
                boxShadow: "none",
                position: "sticky",
                top: 20,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 3, color: Colors.text.default }}
              >
                Order Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                {cartItems.map((item) => (
                  <Box
                    key={item._id}
                    sx={{
                      display: "flex",
                      gap: 2,
                      mb: 2,
                      pb: 2,
                      borderBottom: `1px solid ${Colors.border.subtle}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: Colors.background.default,
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: "600" }}>
                        {item.name}
                      </Typography>
                      <Typography
                        sx={{ color: Colors.text.default, fontSize: "0.9rem" }}
                      >
                        x{item.quantity}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: "600" }}>
                      £{(Number(item.price) * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: Colors.text.default }}>
                    Subtotal
                  </Typography>
                  <Typography>£{subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: Colors.text.default }}>
                    Delivery
                  </Typography>
                  <Typography>£{shippingFee.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: Colors.text.default }}>
                    Discount
                  </Typography>
                  <Typography>-£{discount.toFixed(2)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: `1px solid ${Colors.border.subtle}`,
                    pt: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>Total</Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    £{total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="filled"
                disabled={
                  isProcessing ||
                  (paymentMethod === "CARD" && Boolean(clientSecret))
                }
                onClick={
                  paymentMethod === "CASH_ON_DELIVERY"
                    ? handleCashPayment
                    : handleCardPayment
                }
                sx={{
                  width: "100%",
                  fontWeight: "bold",
                  py: 1.5,
                  fontSize: "1rem",
                  mt: 3,
                }}
              >
                {isProcessing ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: "white" }} />
                    {processingStep || "Processing..."}
                  </Box>
                ) : paymentMethod === "CASH_ON_DELIVERY" ? (
                  "Place Order"
                ) : clientSecret ? (
                  "Payment Ready"
                ) : (
                  "Prepare Payment"
                )}
              </Button>

              {error && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: "rgba(229, 57, 53, 0.1)",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ color: "#e53935", fontSize: "0.9rem" }}>
                    {error}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "center",
                  color: Colors.text.placeholder,
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: "1rem" }} />
                <Typography sx={{ fontSize: "0.8rem" }}>
                  Your payment is secure
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PaymentPage;
