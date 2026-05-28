import { Box, Typography, Card } from "@mui/material";
import { Colors } from "../theme/colors";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../features/menu/components/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = location.state?.orderId || null;
  const orderDetails = location.state?.orderDetails;
  const paymentMethod = location.state?.paymentMethod;
  const isSuccess = orderId !== null;
  const isCashOnDelivery = paymentMethod === "cash";

  // Use passed orderDetails, fallback to calculating from empty cart (will be 0)
  const subtotal = orderDetails?.subtotal ?? 0;
  const shippingFee = orderDetails?.shippingFee ?? 5.0;
  const serviceFee = orderDetails?.serviceFee ?? 0.99;
  const discount = orderDetails?.discount ?? 0;
  const total =
    orderDetails?.total ?? subtotal + shippingFee + serviceFee - discount;

  if (!isSuccess) {
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
              Order Failed
            </Typography>

            <Typography sx={{ mb: 3, color: Colors.text.default }}>
              Something went wrong. Please try again.
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
            #{orderId}
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
