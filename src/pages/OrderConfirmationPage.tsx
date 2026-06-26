import { Box, Typography, Card, CircularProgress } from "@mui/material";
import { Colors } from "../theme/colors";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../features/menu/components/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { getOrderById } from "../services/order.service";
import { Order } from "../types/order.types";

interface OrderSummaryDetails {
  orderNumber?: string;
  paymentMethod?: string | null;
  subtotal?: number;
  shippingFee?: number;
  deliveryFee?: number;
  serviceFee?: number;
  discount?: number;
  discountAmount?: number;
  total?: number;
  totalAmount?: number;
  estimatedDeliveryAt?: string | null;
}

interface OrderConfirmationLocationState {
  orderId?: string;
  orderDetails?: OrderSummaryDetails;
  paymentMethod?: string | null;
}

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId: routeOrderId } = useParams<{ orderId: string }>();
  const navigationState =
    location.state as OrderConfirmationLocationState | null;
  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(
    Boolean(routeOrderId && !navigationState?.orderDetails),
  );

  const orderId = navigationState?.orderId ?? routeOrderId ?? null;
  const orderDetails = navigationState?.orderDetails;
  const paymentMethod =
    navigationState?.paymentMethod ??
    orderDetails?.paymentMethod ??
    fetchedOrder?.paymentMethod;
  const isSuccess = orderId !== null;
  const isCashOnDelivery = paymentMethod?.toLowerCase() === "cash";

  useEffect(() => {
    if (!orderId || orderDetails) {
      return;
    }

    let isMounted = true;

    const loadOrder = async () => {
      setIsLoadingOrder(true);
      const order = await getOrderById(orderId);

      if (isMounted) {
        setFetchedOrder(order);
        setIsLoadingOrder(false);
      }
    };

    void loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderDetails, orderId]);

  // Use passed orderDetails, fallback to calculating from empty cart (will be 0)
  const subtotal = orderDetails?.subtotal ?? fetchedOrder?.subtotal ?? 0;
  const shippingFee =
    orderDetails?.shippingFee ??
    orderDetails?.deliveryFee ??
    fetchedOrder?.deliveryFee ??
    0;
  const serviceFee = orderDetails?.serviceFee ?? fetchedOrder?.serviceFee ?? 0;
  const discount =
    orderDetails?.discount ??
    orderDetails?.discountAmount ??
    fetchedOrder?.discountAmount ??
    0;
  const total =
    orderDetails?.total ??
    orderDetails?.totalAmount ??
    fetchedOrder?.totalAmount ??
    subtotal + shippingFee + serviceFee - discount;
  const orderNumber =
    orderDetails?.orderNumber ?? fetchedOrder?.orderNumber ?? orderId;

  if (isLoadingOrder) {
    return (
      <Box
        sx={{
          mt: 7,
          minHeight: { xs: "auto", md: "calc(100vh - 130px)" },
          backgroundColor: Colors.background.default,
          pt: { xs: 3, md: 4 },
          pb: { xs: 3, md: 4 },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: "600px",
            mx: { xs: 2, md: "auto" },
            p: { xs: 3, md: 4 },
            borderRadius: "12px",
            border: `1px solid ${Colors.border.subtle}`,
            boxShadow: "none",
            textAlign: "center",
          }}
        >
          <CircularProgress
            aria-label="Loading order confirmation"
            size={42}
            thickness={4}
            sx={{ color: Colors.background.brand, mb: 2 }}
          />
          <Typography sx={{ color: Colors.text.default, fontWeight: 600 }}>
            Loading your order ...
          </Typography>
        </Card>
      </Box>
    );
  }

  if (!isSuccess || (routeOrderId && !orderDetails && !fetchedOrder)) {
    return (
      <Box
        sx={{
          mt: 7,
          minHeight: { xs: "auto", md: "calc(100vh - 130px)" },
          backgroundColor: Colors.background.default,
          pt: { xs: 3, md: 4 },
          pb: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            maxWidth: "600px",
            mx: "auto",
            px: { xs: 2, md: 3 },
          }}
        >
          <Card
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: "12px",
              border: `1px solid ${Colors.border.subtle}`,
              boxShadow: "none",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#e53935",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <ErrorIcon sx={{ fontSize: 50, color: "white" }} />
            </Box>

            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 1, color: Colors.text.default }}
            >
              Order Not Found
            </Typography>

            <Typography sx={{ mb: 3, color: Colors.text.default }}>
              We could not find that order. Please open it from your order
              history.
            </Typography>

            <Button
              variant="filled"
              onClick={() => navigate("/")}
              sx={{
                width: "100%",
                fontWeight: "bold",
                py: 1.5,
                fontSize: "1rem",
                mt: 3,
              }}
            >
              Back to Home
            </Button>
          </Card>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 7,
        minHeight: { xs: "auto", md: "calc(100vh - 130px)" },
        backgroundColor: Colors.background.default,
        pt: { xs: 3, md: 4 },
        pb: { xs: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: "600px",
          mx: "auto",
          px: { xs: 2, md: 3 },
        }}
      >
        <Card
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: "12px",
            border: `1px solid ${Colors.border.subtle}`,
            boxShadow: "none",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: Colors.background.brand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 50, color: "white" }} />
          </Box>

          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 1, color: Colors.text.default }}
          >
            Order Confirmed!
          </Typography>

          <Typography sx={{ mb: 3, color: Colors.text.default }}>
            {isCashOnDelivery
              ? "Thank you for your order. Your food is being prepared, and you can pay when it arrives."
              : "Thank you for your order. Your food is being prepared!"}
          </Typography>

          <Typography sx={{ mb: 1, color: Colors.text.default }}>
            Order Number
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            #{orderNumber}
          </Typography>

          <Box
            sx={{
              borderTop: `1px solid ${Colors.border.subtle}`,
              pt: 3,
              mt: 3,
            }}
          >
            <Typography sx={{ mb: 2, color: Colors.text.default }}>
              Estimated delivery: 25-35 minutes
            </Typography>

            <Typography sx={{ mb: 1, color: Colors.text.default }}>
              {isCashOnDelivery ? "Have this amount ready" : "Total Paid"}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              £{total.toFixed(2)}
            </Typography>
            {isCashOnDelivery && (
              <Typography
                sx={{
                  mt: 1,
                  color: Colors.text.placeholder,
                  fontSize: "0.9rem",
                }}
              >
                Please pay the rider in cash when your order arrives.
              </Typography>
            )}
          </Box>

          <Button
            variant="filled"
            onClick={() => navigate("/")}
            sx={{
              width: "100%",
              fontWeight: "bold",
              py: 1.5,
              fontSize: "1rem",
              mt: 3,
            }}
          >
            Order More Food
          </Button>
        </Card>
      </Box>
    </Box>
  );
};

export default OrderConfirmationPage;
