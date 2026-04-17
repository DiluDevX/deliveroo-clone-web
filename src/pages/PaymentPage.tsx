import { Box, Typography, Grid, Card, CircularProgress } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Colors } from "../theme/colors";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import Button from "../features/menu/components/Button";
import TextInput from "../features/menu/components/TextInput";
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

const cardSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be 16 digits"),
  expiryDate: z.string().min(4, "Expiry date is required"),
  cvv: z.string().min(3, "CVV must be 3 digits"),
  nameOnCard: z.string().min(1, "Name on card is required"),
});

type PaymentFormValues = {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
};

type CheckoutData = {
  address: string;
  city: string;
  zipCode: string;
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const [deliveryMethod] = useState("delivery");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [progress, setProgress] = useState(50);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const checkoutData = location.state?.checkoutData as CheckoutData | null;
  const restaurantId = localStorage.getItem("selected-restaurant-id") || "";
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

  const handlePayment = async () => {
    if (
      !checkoutData?.address ||
      !checkoutData?.city ||
      !checkoutData?.zipCode
    ) {
      setError("Missing delivery address");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingStep("Creating order...");

    const checkoutRequest = {
      deliveryAddress: {
        line1: checkoutData.address,
        city: checkoutData.city,
        postcode: checkoutData.zipCode,
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

    setProcessingStep("Processing payment...");

    const amountInPennies = Math.round(total * 100);

    const paymentIntent = await createPaymentIntent({
      orderId: orderResponse.orderId,
      userId: user?.id || "",
      restaurantId,
      amount: amountInPennies,
      currency: "USD",
      paymentMethod: "CARD",
      commissionPercentage: 15,
    });

    if (paymentIntent?.data?.id) {
      setProcessingStep("Confirming payment...");
      const confirmed = await confirmPayment(paymentIntent.data.id);
      if (confirmed) {
        dispatch(clearCartAndSync());
        navigate("/order-confirmation", {
          state: { orderId: orderResponse.orderNumber },
        });
      } else {
        setIsProcessing(false);
        setError("Payment failed. Please try again.");
        setProcessingStep("");
      }
    } else {
      setIsProcessing(false);
      setError("Failed to process payment. Please try again.");
      setProcessingStep("");
    }
  };

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: "",
    },
    mode: "onChange",
  });

  const {
    control,
    formState: { isValid },
  } = form;

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0,
  );

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

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Controller
                  name="cardNumber"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInput
                      {...field}
                      fullWidth
                      label="Card Number"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16);
                        field.onChange(value);
                      }}
                      error={fieldState.error?.message}
                      placeholder="1234 5678 9012 3456"
                    />
                  )}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Controller
                    name="expiryDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextInput
                        {...field}
                        fullWidth
                        label="Expiry Date"
                        value={field.value || ""}
                        onChange={(e) => {
                          let value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);
                          if (value.length > 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2);
                          }
                          field.onChange(value);
                        }}
                        error={fieldState.error?.message}
                        placeholder="MM/YY"
                      />
                    )}
                  />

                  <Controller
                    name="cvv"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextInput
                        {...field}
                        fullWidth
                        label="CVV"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 3);
                          field.onChange(value);
                        }}
                        error={fieldState.error?.message}
                        placeholder="123"
                        type="password"
                      />
                    )}
                  />
                </Box>

                <Controller
                  name="nameOnCard"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInput
                      {...field}
                      fullWidth
                      label="Name on Card"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={fieldState.error?.message}
                      placeholder="JOHN DOE"
                    />
                  )}
                />
              </Box>
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
                disabled={!isValid || isProcessing}
                onClick={handlePayment}
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
                ) : (
                  "Proceed"
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
