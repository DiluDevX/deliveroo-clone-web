import {
  Box,
  Typography,
  Grid,
  Card,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { Colors } from "../theme/colors";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAppSelector, useAppDispatch } from "../store/hooks/cartHooks";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {
  createPaymentIntent,
  confirmPayment,
  getUserPaymentMethods,
} from "../services/payment.service";
import { checkoutCart } from "../services/order.service";
import { syncCart as syncCartToBackend } from "../services/cart.service";
import { clearCartAndSync } from "../store/cartSlice";
import { stripePromise } from "../config/stripe";
import { StripeCardForm } from "../features/menu/components/StripeCardForm";
import { CheckoutRequest, Order } from "../types/order.types";
import { UserPaymentMethod } from "../types/payment.types";

type CheckoutData = {
  address?: string;
  city?: string;
  zipCode?: string;
};

type ResumePaymentState = {
  order: Order;
};

const CardPaymentSkeleton = () => (
  <Card
    sx={{
      p: 3,
      borderRadius: "12px",
      border: `1px solid ${Colors.border.subtle}`,
      boxShadow: "none",
    }}
  >
    <Skeleton
      variant="text"
      width={140}
      height={32}
      animation="wave"
      sx={{ mb: 2 }}
    />

    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Skeleton variant="text" width={110} height={22} animation="wave" />
        <Skeleton
          variant="rounded"
          width="100%"
          height={48}
          animation="wave"
          sx={{ borderRadius: "8px" }}
        />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <Box>
          <Skeleton variant="text" width={88} height={22} animation="wave" />
          <Skeleton
            variant="rounded"
            width="100%"
            height={48}
            animation="wave"
            sx={{ borderRadius: "8px" }}
          />
        </Box>
        <Box>
          <Skeleton variant="text" width={42} height={22} animation="wave" />
          <Skeleton
            variant="rounded"
            width="100%"
            height={48}
            animation="wave"
            sx={{ borderRadius: "8px" }}
          />
        </Box>
      </Box>

      <Skeleton variant="text" width="72%" height={20} animation="wave" />
      <Skeleton
        variant="rounded"
        width="100%"
        height={48}
        animation="wave"
        sx={{ borderRadius: "8px", mt: 1 }}
      />
    </Box>
  </Card>
);

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
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<
    UserPaymentMethod[]
  >([]);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [confirmedOrderDetails, setConfirmedOrderDetails] = useState<{
    subtotal: number;
    shippingFee: number;
    serviceFee: number;
    discount: number;
    total: number;
  } | null>(null);
  const orderCreatedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Reset order created flag when navigating away or on component unmount
  useEffect(() => {
    return () => {
      orderCreatedRef.current = false;
    };
  }, []);

  const checkoutData = location.state?.checkoutData as CheckoutData | null;
  const deliveryMethod = (location.state?.deliveryMethod || "delivery") as
    | "delivery"
    | "pickup";
  const paymentMethod = (location.state?.paymentMethod || "CARD") as
    | "CARD"
    | "CASH_ON_DELIVERY";
  const resumeOrder = (location.state as ResumePaymentState | null)?.order;
  const restaurantName =
    resumeOrder?.restaurantName ||
    localStorage.getItem("selected-restaurant-name") ||
    "Restaurant";
  const restaurantAddress =
    resumeOrder?.restaurantAddress ||
    localStorage.getItem("selected-restaurant-address") ||
    "";

  const shippingFee =
    resumeOrder?.deliveryFee ?? (deliveryMethod === "delivery" ? 5 : 0);
  const serviceFee = resumeOrder?.serviceFee ?? 0.99;
  const discount = resumeOrder?.discountAmount ?? 0;
  const total =
    resumeOrder?.totalAmount ??
    cartItems.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0,
    ) +
      shippingFee +
      serviceFee -
      discount;

  const subtotal =
    resumeOrder?.subtotal ??
    cartItems.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0,
    );
  const summaryItems =
    resumeOrder?.items.map((item) => ({
      id: item.id,
      name: item.dishName,
      image: item.dishImageUrl ?? undefined,
      quantity: item.quantity,
      total: item.lineTotal,
    })) ??
    cartItems.map((item) => ({
      id: item._id,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      total: Number(item.price) * item.quantity,
    }));
  const displaySubtotal = confirmedOrderDetails?.subtotal ?? subtotal;
  const displayShippingFee = confirmedOrderDetails?.shippingFee ?? shippingFee;
  const displayServiceFee = confirmedOrderDetails?.serviceFee ?? serviceFee;
  const displayDiscount = confirmedOrderDetails?.discount ?? discount;
  const displayTotal = confirmedOrderDetails?.total ?? total;

  useEffect(() => {
    if (paymentMethod !== "CARD") {
      setSavedPaymentMethods([]);
      return;
    }

    let isActive = true;

    const loadSavedPaymentMethods = async () => {
      const paymentMethods = await getUserPaymentMethods();

      if (isActive) {
        setSavedPaymentMethods(paymentMethods);
      }
    };

    void loadSavedPaymentMethods();

    return () => {
      isActive = false;
    };
  }, [paymentMethod]);

  const hasRequiredDeliveryAddress = useCallback(() => {
    if (deliveryMethod !== "delivery") {
      return true;
    }

    return Boolean(
      checkoutData?.address && checkoutData.city && checkoutData.zipCode,
    );
  }, [
    checkoutData?.address,
    checkoutData?.city,
    checkoutData?.zipCode,
    deliveryMethod,
  ]);

  const canStartPayment = useCallback(() => {
    if (resumeOrder) {
      return true;
    }

    if (!hasRequiredDeliveryAddress()) {
      setError("Missing delivery address");
      return false;
    }

    return true;
  }, [hasRequiredDeliveryAddress, resumeOrder]);

  const buildCheckoutRequest = useCallback(
    (checkoutPaymentMethod: "card" | "cash"): CheckoutRequest => {
      return {
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
        paymentMethod: checkoutPaymentMethod,
      };
    },
    [
      checkoutData?.address,
      checkoutData?.city,
      checkoutData?.zipCode,
      discount,
      restaurantAddress,
      restaurantName,
      serviceFee,
      shippingFee,
    ],
  );

  const stopPaymentProcessing = () => {
    setIsProcessing(false);
    setProcessingStep("");
  };

  const getOrderDetails = useCallback(
    () => ({
      subtotal,
      shippingFee,
      serviceFee,
      discount,
      total,
    }),
    [discount, serviceFee, shippingFee, subtotal, total],
  );

  const navigateToOrderConfirmation = useCallback(
    (confirmationOrderId: string, clearCartOnSuccess: boolean) => {
      if (clearCartOnSuccess) {
        dispatch(clearCartAndSync());
      }

      sessionStorage.removeItem("pending-card-order");
      navigate("/order-confirmation", {
        state: {
          orderId: confirmationOrderId,
          orderDetails: confirmedOrderDetails ?? getOrderDetails(),
        },
      });
    },
    [confirmedOrderDetails, dispatch, getOrderDetails, navigate],
  );

  const handlePaymentError = useCallback((err: unknown, context: string) => {
    const message =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred. Please try again.";

    setError(message);
    console.error(context, err);
  }, []);

  /**
   * Auto-initialize payment on page load
   * Syncs cart, creates order, and prepares payment method
   */
  useEffect(() => {
    // Only run once per session
    if (orderCreatedRef.current || !canStartPayment()) {
      return;
    }

    let isActive = true;

    const initializePayment = async () => {
      try {
        orderCreatedRef.current = true;
        setIsProcessing(true);
        setError(null);

        // For resuming a previous payment, recreate/retrieve the PaymentIntent.
        // The backend is idempotent by orderId, so this returns the existing Stripe intent.
        if (resumeOrder) {
          if (!isActive) return;

          const resumedOrderDetails = {
            subtotal: resumeOrder.subtotal,
            shippingFee: resumeOrder.deliveryFee,
            serviceFee: resumeOrder.serviceFee,
            discount: resumeOrder.discountAmount,
            total: resumeOrder.totalAmount,
          };

          if (paymentMethod === "CARD") {
            setProcessingStep("Preparing payment...");

            const paymentIntent = await createPaymentIntent({
              orderId: resumeOrder.id,
              expectedTotalAmount: resumeOrder.totalAmount,
            });

            if (!isActive) return;

            const paymentData = paymentIntent?.data;

            if (!paymentData?.clientSecret || !paymentData.paymentId) {
              throw new Error("Failed to process payment. Please try again.");
            }

            setConfirmedOrderDetails(resumedOrderDetails);
            setOrderNumber(resumeOrder.orderNumber);
            sessionStorage.setItem(
              "pending-card-order",
              JSON.stringify({
                orderId: resumeOrder.id,
                orderNumber: resumeOrder.orderNumber,
                totalAmount: resumeOrder.totalAmount,
              }),
            );

            setPaymentId(paymentData.paymentId);
            setClientSecret(paymentData.clientSecret);
          }

          return;
        }

        // Get restaurantId from localStorage
        const restaurantId = localStorage.getItem("selected-restaurant-id");

        if (!restaurantId) {
          throw new Error(
            "Restaurant ID not found. Please select a restaurant.",
          );
        }

        if (cartItems.length === 0) {
          throw new Error("Cart is empty. Please add items before checkout.");
        }

        // Sync cart to backend
        if (!isActive) return;
        setProcessingStep("Syncing cart...");
        const syncResult = await syncCartToBackend(cartItems, restaurantId);

        if (!syncResult) {
          throw new Error("Failed to sync cart. Please try again.");
        }

        // Create order
        if (!isActive) return;
        setProcessingStep("Creating order...");
        const orderResponse = await checkoutCart(
          buildCheckoutRequest(paymentMethod === "CARD" ? "card" : "cash"),
        );

        if (!orderResponse?.orderId) {
          throw new Error("Failed to create order. Please try again.");
        }

        if (!isActive) return;

        const orderDetails = {
          subtotal: orderResponse.subtotal,
          shippingFee: orderResponse.deliveryFee,
          serviceFee: orderResponse.serviceFee,
          discount: orderResponse.discountAmount,
          total: orderResponse.totalAmount,
        };

        // Handle card payment - create PaymentIntent
        if (paymentMethod === "CARD") {
          if (!isActive) return;
          setProcessingStep("Preparing payment...");

          const paymentIntent = await createPaymentIntent({
            orderId: orderResponse.orderId,
            expectedTotalAmount: orderResponse.totalAmount,
          });

          if (!isActive) return;

          const paymentData = paymentIntent?.data;

          if (!paymentData?.clientSecret || !paymentData.paymentId) {
            throw new Error("Failed to process payment. Please try again.");
          }

          setConfirmedOrderDetails(orderDetails);
          setOrderNumber(orderResponse.orderNumber);
          sessionStorage.setItem(
            "pending-card-order",
            JSON.stringify({
              orderId: orderResponse.orderId,
              orderNumber: orderResponse.orderNumber,
              totalAmount: orderResponse.totalAmount,
            }),
          );

          setPaymentId(paymentData.paymentId);
          setClientSecret(paymentData.clientSecret);
        } else {
          setConfirmedOrderDetails(orderDetails);
          setOrderNumber(orderResponse.orderNumber);
          // Cash on delivery - automatically navigate to confirmation
          if (!isActive) return;
          setProcessingStep("Order confirmed...");
          setTimeout(() => {
            if (isActive) {
              navigateToOrderConfirmation(orderResponse.orderNumber, true);
            }
          }, 1000);
        }
      } catch (err) {
        if (!isActive) return;

        orderCreatedRef.current = false;
        handlePaymentError(err, "Payment initialization error:");
      } finally {
        if (isActive) {
          setIsProcessing(false);
        }
      }
    };

    void initializePayment();

    return () => {
      isActive = false;
    };
  }, [
    buildCheckoutRequest,
    canStartPayment,
    cartItems,
    checkoutData?.address,
    checkoutData?.city,
    checkoutData?.zipCode,
    deliveryMethod,
    handlePaymentError,
    navigateToOrderConfirmation,
    paymentMethod,
    resumeOrder,
  ]);

  const handleStripePaymentSucceeded = async (): Promise<boolean> => {
    if (!paymentId) {
      setError("Payment setup failed. Please try again.");
      return false;
    }

    setIsProcessing(true);
    setProcessingStep("Finalizing payment...");

    try {
      const confirmed = await confirmPayment(paymentId);

      if (!confirmed) {
        throw new Error("Payment confirmation failed. Please try again.");
      }

      navigateToOrderConfirmation(orderNumber || "unknown", !resumeOrder);
      return true;
    } catch (err) {
      handlePaymentError(err, "Payment confirmation error:");
      return false;
    } finally {
      stopPaymentProcessing();
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
          <Grid item xs={12} md={7} sx={{ order: { xs: 2, md: 1 } }}>
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
                        onPaymentSuccess={handleStripePaymentSucceeded}
                        onPaymentError={setError}
                        totalAmount={displayTotal}
                        savedPaymentMethods={savedPaymentMethods}
                      />
                    </Elements>
                  ) : (
                    <CardPaymentSkeleton />
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
                  {isProcessing ? (
                    <>
                      <CircularProgress size={40} sx={{ mb: 2 }} />
                      <Typography
                        sx={{ color: Colors.text.default, fontWeight: "500" }}
                      >
                        {processingStep || "Processing..."}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon
                        sx={{
                          fontSize: "3rem",
                          color: Colors.background.brand,
                          mb: 2,
                        }}
                      />
                      <Typography
                        sx={{
                          color: Colors.text.default,
                          mb: 1,
                          fontWeight: "600",
                        }}
                      >
                        Order Confirmed
                      </Typography>
                      <Typography
                        sx={{
                          color: Colors.text.placeholder,
                          fontSize: "0.9rem",
                        }}
                      >
                        You will pay in cash when your order is delivered.
                      </Typography>
                    </>
                  )}
                </Box>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={5} sx={{ order: { xs: 1, md: 2 } }}>
            <Card
              sx={{
                p: 3,
                borderRadius: "12px",
                border: `1px solid ${Colors.border.subtle}`,
                boxShadow: "none",
                position: { xs: "static", md: "sticky" },
                top: { md: 20 },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 3, color: Colors.text.default }}
              >
                Order Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                {summaryItems.map((item) => (
                  <Box
                    key={item.id}
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
                      £{item.total.toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: Colors.text.default }}>
                    Subtotal
                  </Typography>
                  <Typography>£{displaySubtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: Colors.text.default }}>
                    Delivery
                  </Typography>
                  <Typography>£{displayShippingFee.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: Colors.text.default }}>
                    Service fee
                  </Typography>
                  <Typography>£{displayServiceFee.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: Colors.text.default }}>
                    Discount
                  </Typography>
                  <Typography>-£{displayDiscount.toFixed(2)}</Typography>
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
                    £{displayTotal.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

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
