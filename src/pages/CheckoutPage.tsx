import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Grid,
  Card,
} from "@mui/material";
import { Colors } from "../theme/colors";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../features/menu/components/Button";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAppSelector } from "../store/hooks/cartHooks";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.items);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Redirect to menu if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/account/login");
    }
  }, [isAuthenticated, navigate]);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0,
  );

  const shippingFee = deliveryMethod === "delivery" ? 5.0 : 0;
  const discount = 0;
  const total = subtotal + shippingFee - discount;

  return (
    <Box
      sx={{
        mt: 7,
        minHeight: "calc(100vh - 130px)",
        backgroundColor: Colors.background.default,
        py: 4,
      }}
    >
      {/* Progress Steps */}
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
            <CheckCircleIcon
              sx={{ color: Colors.background.brand, scale: "1.5" }}
            />
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
            <CheckCircleIcon
              sx={{ color: Colors.background.brand, scale: "1.5" }}
            />
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
              background: `linear-gradient(to right, ${Colors.background.brand} 50%, ${Colors.border.subtle} 50%)`,
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
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
                scale: "1.3",
              }}
            >
              3
            </Box>
            <Typography
              sx={{
                color: Colors.text.default,
                fontWeight: "bold",
                display: { xs: "none", sm: "block" },
              }}
            >
              Checkout
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: 3,
        }}
      >
        <Grid container spacing={4}>
          {/* Left Column - Checkout Form */}
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
                Checkout
              </Typography>

              {/* Delivery Method */}
              <Typography
                sx={{
                  fontWeight: "600",
                  mb: 2,
                  color: Colors.text.default,
                }}
              >
                Shipping Information
              </Typography>

              <RadioGroup
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                sx={{ mb: 3, display: "flex", gap: 2, flexDirection: "row" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: { xs: "100%", sm: "auto" },
                      border: `2px solid ${
                        deliveryMethod === "delivery"
                          ? Colors.border.default
                          : Colors.border.subtle
                      }`,
                      borderRadius: "8px",
                      p: 2,
                      cursor: "pointer",
                      backgroundColor:
                        deliveryMethod === "delivery"
                          ? "rgba(2, 189, 174, 0.05)"
                          : "transparent",
                    }}
                    onClick={() => setDeliveryMethod("delivery")}
                  >
                    <FormControlLabel
                      value="delivery"
                      control={<Radio />}
                      label={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LocalShippingOutlinedIcon />
                          <Typography>Delivery</Typography>
                        </Box>
                      }
                    />
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: { xs: "100%", sm: "auto" },
                      border: `2px solid ${
                        deliveryMethod === "pickup"
                          ? Colors.border.default
                          : Colors.border.subtle
                      }`,
                      borderRadius: "8px",
                      p: 2,
                      cursor: "pointer",
                      backgroundColor:
                        deliveryMethod === "pickup"
                          ? "rgba(2, 189, 174, 0.05)"
                          : "transparent",
                    }}
                    onClick={() => setDeliveryMethod("pickup")}
                  >
                    <FormControlLabel
                      value="pickup"
                      control={<Radio />}
                      label={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <StorefrontOutlinedIcon />
                          <Typography>Pick up</Typography>
                        </Box>
                      }
                    />
                  </Box>
                </Box>
              </RadioGroup>

              {/* Form Fields */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  fullWidth
                  label="Full name"
                  required
                  defaultValue={
                    user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : ""
                  }
                  placeholder="Enter full name"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Email address"
                  required
                  type="email"
                  defaultValue={user?.email || ""}
                  placeholder="Enter email address"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Phone number"
                  required
                  type="tel"
                  defaultValue={user?.phone || ""}
                  placeholder="Enter phone number"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />

                {deliveryMethod === "delivery" && (
                  <>
                    <TextField
                      fullWidth
                      label="Address"
                      required
                      placeholder="Enter delivery address"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        fullWidth
                        label="City"
                        placeholder="Enter city"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="State"
                        placeholder="Enter state"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="ZIP Code"
                        placeholder="Enter ZIP code"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </Box>
                  </>
                )}

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "0.9rem" }}>
                      I have read and agree to the Terms and Conditions
                    </Typography>
                  }
                />
              </Box>
            </Card>
          </Grid>

          {/* Right Column - Order Summary */}
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
                Review your cart
              </Typography>

              {/* Cart Items */}
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
                        backgroundColor: Colors.background.lighterDark,
                      }}
                    >
                      <img
                        src="/src/assets/images/salad.jpeg"
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{ fontWeight: "500", fontSize: "0.9rem" }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          color: Colors.text.light,
                        }}
                      >
                        {item.quantity}x
                      </Typography>
                      <Typography sx={{ fontWeight: "bold", mt: 0.5 }}>
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Discount Code */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 3,
                  pb: 3,
                  borderBottom: `1px solid ${Colors.border.subtle}`,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Discount code"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
                <Button
                  variant="border"
                  sx={{
                    minWidth: "80px",
                    fontWeight: "bold",
                  }}
                >
                  Apply
                </Button>
              </Box>

              {/* Price Breakdown */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{ color: Colors.text.light }}>
                    Subtotal
                  </Typography>
                  <Typography sx={{ fontWeight: "500" }}>
                    ${subtotal.toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{ color: Colors.text.light }}>
                    Shipping
                  </Typography>
                  <Typography sx={{ fontWeight: "500" }}>
                    ${shippingFee.toFixed(2)}
                  </Typography>
                </Box>
                {discount > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography sx={{ color: Colors.text.light }}>
                      Discount
                    </Typography>
                    <Typography sx={{ fontWeight: "500", color: "red" }}>
                      -${discount.toFixed(2)}
                    </Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    pt: 2,
                    borderTop: `2px solid ${Colors.border.default}`,
                  }}
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    Total
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    ${total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Pay Button */}
              <Button
                variant="filled"
                disabled={!agreedToTerms}
                sx={{
                  width: "100%",
                  fontWeight: "bold",
                  py: 1.5,
                  fontSize: "1rem",
                }}
              >
                Pay Now
              </Button>

              {/* Security Notice */}
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                <LockOutlinedIcon
                  sx={{ fontSize: "1rem", color: Colors.text.light }}
                />
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: Colors.text.light,
                    fontWeight: "500",
                  }}
                >
                  Secure Checkout - SSL Encrypted
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: Colors.text.light,
                  textAlign: "center",
                  mt: 1,
                }}
              >
                Ensuring your financial and personal details are secure during
                every transaction.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
