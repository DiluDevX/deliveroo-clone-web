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
  IconButton,
  CircularProgress,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Colors } from "../theme/colors";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "../features/menu/components/Button";
import TextInput from "../features/menu/components/TextInput";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MoneyIcon from "@mui/icons-material/Money";
import { useAppSelector, useAppDispatch } from "../store/hooks/cartHooks";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  updateQuantityAndSync,
  removeItemAndSync,
  clearCartAndSync,
  syncCartToServer,
} from "../store/cartSlice";
import { DeliveryDiningSharp, ShoppingBagOutlined } from "@mui/icons-material";
import { checkoutCart } from "../services/order.service";
import { showErrorSnackbar } from "../utils/notifications";

type PaymentMethod = "CARD" | "CASH_ON_DELIVERY";

const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(10, "Phone number should be at most 10 digits"),
});

type CheckoutFormValues = {
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  agreedToTerms: boolean;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [discountCode, setDiscountCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const effectiveDeliveryMethod =
    paymentMethod === "CASH_ON_DELIVERY" ? "delivery" : deliveryMethod;

  const isPhoneMissing = !user?.phone;

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === "CASH_ON_DELIVERY") {
      setDeliveryMethod("delivery");
    }
  };

  const getSchema = () => {
    const phonePart = isPhoneMissing
      ? { phone: phoneSchema.shape.phone }
      : { phone: z.string().optional() };

    return z.object({
      phone: phonePart.phone,
      address: z.string().optional(),
      city: z.string().optional(),
      zipCode: z.string().optional(),
      agreedToTerms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms and conditions",
      }),
    });
  };

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      phone: user?.phone || "",
      address: "",
      city: "",
      zipCode: "",
      agreedToTerms: true,
    },
    mode: "onChange",
  });

  const {
    control,
    formState: { isValid },
    watch,
  } = form;

  const agreedToTerms = watch("agreedToTerms", false);
  const phone = watch("phone", "");
  const address = watch("address", "");
  const city = watch("city", "");
  const zipCode = watch("zipCode", "");
  const hasRequiredContact = !isPhoneMissing || Boolean(phone?.trim());
  const hasRequiredAddress =
    effectiveDeliveryMethod !== "delivery" ||
    (Boolean(address?.trim()) &&
      Boolean(city?.trim()) &&
      Boolean(zipCode?.trim()));
  const canPlaceOrder =
    isValid && agreedToTerms && hasRequiredContact && hasRequiredAddress;

  const handlePlaceOrder = form.handleSubmit(async (data) => {
    if (!hasRequiredAddress) {
      showErrorSnackbar("Please enter a delivery address.");
      return;
    }

    setIsProcessing(true);
    const syncResult = await dispatch(syncCartToServer());
    if (syncCartToServer.rejected.match(syncResult) || !syncResult.payload) {
      setIsProcessing(false);
      showErrorSnackbar("Failed to sync cart. Please try again.");
      return;
    }

    if (paymentMethod === "CASH_ON_DELIVERY") {
      const restaurantName =
        localStorage.getItem("selected-restaurant-name") || "Restaurant";
      const restaurantAddress =
        localStorage.getItem("selected-restaurant-address") || "";

      const checkoutRequest = {
        deliveryAddress: {
          line1: data.address || "",
          city: data.city || "",
          postcode: data.zipCode || "",
          country: "UK",
        },
        restaurantName,
        restaurantAddress,
        deliveryFee: shippingFee,
        serviceFee: 0.99,
        discountAmount: 0,
        paymentMethod: "cash_on_delivery",
      };

      const orderResponse = await checkoutCart(checkoutRequest);
      setIsProcessing(false);

      if (orderResponse?.orderId) {
        setOrderPlaced(true);
        dispatch(clearCartAndSync());
        navigate("/order-confirmation", {
          state: {
            orderId: orderResponse.orderNumber,
            orderDetails: {
              subtotal,
              shippingFee,
              serviceFee: 0.99,
              discount: 0,
              total: subtotal + shippingFee + 0.99,
            },
          },
        });
      } else {
        showErrorSnackbar("Failed to place order. Please try again.");
      }
      return;
    }

    setIsProcessing(false);
    navigate("/payment", {
      state: { checkoutData: data, deliveryMethod, paymentMethod },
    });
  });

  const handleIncrement = (itemId: string) => {
    const item = cartItems.find(
      (i) => i.cartItemId === itemId || i._id === itemId,
    );
    if (item) {
      const cartItemId = item.cartItemId || item._id;
      dispatch(
        updateQuantityAndSync({
          cartItemId,
          quantity: item.quantity + 1,
        }),
      );
    }
  };

  const handleDecrement = (itemId: string) => {
    const item = cartItems.find(
      (i) => i.cartItemId === itemId || i._id === itemId,
    );
    if (item && item.quantity > 1) {
      const cartItemId = item.cartItemId || item._id;
      dispatch(
        updateQuantityAndSync({
          cartItemId,
          quantity: item.quantity - 1,
        }),
      );
    }
  };

  const handleRemove = (cartItemId: string) => {
    dispatch(removeItemAndSync(cartItemId));
  };

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate("/");
    }
  }, [cartItems, navigate, orderPlaced]);

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

  const shippingFee = effectiveDeliveryMethod === "delivery" ? 5.0 : 0;
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
      <Box sx={{ maxWidth: "1200px", mx: "auto", mb: 4, px: 3 }}>
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
              background: `linear-gradient(to right, ${Colors.background.brand} 50%, ${Colors.border.subtle} 50%)`,
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
              <ShoppingBagOutlined sx={{ scale: "0.8" }} />
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

      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                p: 3,
                borderRadius: "12px",
                border: `1px solid ${Colors.border.subtle}`,
                boxShadow: "none",
                minHeight: "100Ch",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 3, color: Colors.text.default }}
              >
                Checkout
              </Typography>

              <Typography
                sx={{ fontWeight: "600", mb: 2, color: Colors.text.default }}
              >
                Shipping Information
              </Typography>
              <RadioGroup
                value={effectiveDeliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                sx={{ mb: 3, display: "flex", gap: 2, flexDirection: "row" }}
              >
                <Box
                  onClick={() => setDeliveryMethod("delivery")}
                  sx={{
                    flex: 1,
                    minWidth: { xs: "100%", sm: "auto" },
                    border: `2px solid ${effectiveDeliveryMethod === "delivery" ? Colors.border.default : Colors.border.subtle}`,
                    borderRadius: "8px",
                    p: 2,
                    cursor: "pointer",
                    backgroundColor:
                      effectiveDeliveryMethod === "delivery"
                        ? "rgba(2, 189, 174, 0.05)"
                        : "transparent",
                  }}
                >
                  <FormControlLabel
                    value="delivery"
                    control={<Radio />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <DeliveryDiningSharp
                          sx={{ color: Colors.background.brand }}
                        />
                        <Typography>Delivery</Typography>
                      </Box>
                    }
                  />
                </Box>
                <Box
                  onClick={() =>
                    paymentMethod !== "CASH_ON_DELIVERY" &&
                    setDeliveryMethod("pickup")
                  }
                  sx={{
                    flex: 1,
                    minWidth: { xs: "100%", sm: "auto" },
                    border: `2px solid ${effectiveDeliveryMethod === "pickup" ? Colors.border.default : Colors.border.subtle}`,
                    borderRadius: "8px",
                    p: 2,
                    cursor:
                      paymentMethod === "CASH_ON_DELIVERY"
                        ? "not-allowed"
                        : "pointer",
                    backgroundColor:
                      effectiveDeliveryMethod === "pickup"
                        ? "rgba(2,189,174,0.05)"
                        : "transparent",
                    opacity: paymentMethod === "CASH_ON_DELIVERY" ? 0.5 : 1,
                  }}
                >
                  <FormControlLabel
                    value="pickup"
                    control={
                      <Radio disabled={paymentMethod === "CASH_ON_DELIVERY"} />
                    }
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <StorefrontOutlinedIcon
                          sx={{ color: Colors.background.brand }}
                        />
                        <Typography>Pick up</Typography>
                      </Box>
                    }
                  />
                </Box>
              </RadioGroup>

              <Typography
                sx={{
                  fontWeight: "600",
                  mb: 2,
                  mt: 3,
                  color: Colors.text.default,
                }}
              >
                Payment Method
              </Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) =>
                  handlePaymentMethodChange(e.target.value as PaymentMethod)
                }
                sx={{ mb: 3, display: "flex", gap: 2, flexDirection: "row" }}
              >
                <Box
                  onClick={() => handlePaymentMethodChange("CARD")}
                  sx={{
                    flex: 1,
                    minWidth: { xs: "100%", sm: "auto" },
                    border: `2px solid ${paymentMethod === "CARD" ? Colors.border.default : Colors.border.subtle}`,
                    borderRadius: "8px",
                    p: 2,
                    cursor: "pointer",
                    backgroundColor:
                      paymentMethod === "CARD"
                        ? "rgba(2, 189, 174, 0.05)"
                        : "transparent",
                  }}
                >
                  <FormControlLabel
                    value="CARD"
                    control={<Radio />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CreditCardIcon
                          sx={{ color: Colors.background.brand }}
                        />
                        <Typography>Card</Typography>
                      </Box>
                    }
                  />
                </Box>
                <Box
                  onClick={() => handlePaymentMethodChange("CASH_ON_DELIVERY")}
                  sx={{
                    flex: 1,
                    minWidth: { xs: "100%", sm: "auto" },
                    border: `2px solid ${paymentMethod === "CASH_ON_DELIVERY" ? Colors.border.default : Colors.border.subtle}`,
                    borderRadius: "8px",
                    p: 2,
                    cursor: "pointer",
                    backgroundColor:
                      paymentMethod === "CASH_ON_DELIVERY"
                        ? "rgba(2,189,174,0.05)"
                        : "transparent",
                  }}
                >
                  <FormControlLabel
                    value="CASH_ON_DELIVERY"
                    control={<Radio />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <MoneyIcon sx={{ color: Colors.background.brand }} />
                        <Typography>Cash on Delivery</Typography>
                      </Box>
                    }
                  />
                </Box>
              </RadioGroup>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: Colors.background.light,
                  }}
                >
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    Contact Information
                  </Typography>
                  <Typography sx={{ color: Colors.text.default }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography sx={{ color: Colors.text.default }}>
                    {user?.email}
                  </Typography>
                  {isPhoneMissing ? (
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextInput
                          {...field}
                          fullWidth
                          label="Phone number"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          error={fieldState.error?.message}
                          placeholder="Enter phone number"
                          sx={{ mt: 1 }}
                        />
                      )}
                    />
                  ) : (
                    <Typography sx={{ color: Colors.text.default }}>
                      {user?.phone}
                    </Typography>
                  )}
                </Box>
              </Box>

              {effectiveDeliveryMethod === "delivery" && (
                <Box sx={{ mt: 3 }}>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    Delivery Address
                  </Typography>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextInput
                        {...field}
                        fullWidth
                        label="Address"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        error={fieldState.error?.message}
                        placeholder="Enter delivery address"
                      />
                    )}
                  />
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextInput
                          {...field}
                          fullWidth
                          label="City"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          error={fieldState.error?.message}
                          placeholder="Enter city"
                        />
                      )}
                    />
                    <Controller
                      name="zipCode"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextInput
                          {...field}
                          fullWidth
                          label="ZIP Code"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          error={fieldState.error?.message}
                          placeholder="Enter ZIP code"
                        />
                      )}
                    />
                  </Box>
                </Box>
              )}

              <Box sx={{ mt: 3 }}>
                <Controller
                  name="agreedToTerms"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          sx={{
                            color: Colors.background.brand,
                            "&.Mui-checked": { color: Colors.background.brand },
                          }}
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          I have read and agree to the Terms and Conditions
                        </Typography>
                      }
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
                minHeight: "100Ch",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 3, color: Colors.text.default }}
              >
                Review your cart
              </Typography>
              <Box sx={{ mb: 3 }}>
                {cartItems.map((item) => (
                  <Box
                    key={item.cartItemId || item._id}
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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: "500", fontSize: "0.9rem" }}
                        >
                          {item.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleRemove(item.cartItemId || item._id)
                          }
                          sx={{ padding: 0, color: Colors.icon.info }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDecrement(item.cartItemId || item._id)
                          }
                          sx={{
                            border: `1px solid ${Colors.border.default}`,
                            borderRadius: "4px",
                            width: 24,
                            height: 24,
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: "0.8rem" }} />
                        </IconButton>
                        <Typography
                          sx={{
                            fontWeight: "600",
                            minWidth: 20,
                            textAlign: "center",
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleIncrement(item.cartItemId || item._id)
                          }
                          sx={{
                            border: `1px solid ${Colors.border.default}`,
                            borderRadius: "4px",
                            width: 24,
                            height: 24,
                          }}
                        >
                          <AddIcon sx={{ fontSize: "0.8rem" }} />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        display: "flex",
                        fontWeight: "bold",
                        alignSelf: "flex-start",
                        minWidth: "60px",
                        justifyContent: "flex-end",
                      }}
                    >
                      £{(Number(item.price) * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  borderBottom: `1px solid ${Colors.border.subtle}`,
                  pb: 3,
                  width: "100%",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <TextField
                  fullWidth
                  size="medium"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Discount code"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "4px" } }}
                />
                <Button
                  variant="filled"
                  sx={{ minWidth: "80px", fontWeight: "bold" }}
                  onClick={() => console.log("Apply discount", discountCode)}
                  disabled={!discountCode.trim()}
                >
                  Apply
                </Button>
              </Box>

              <Box sx={{ mb: 3, mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{ color: Colors.text.default }}>
                    Subtotal
                  </Typography>
                  <Typography sx={{ fontWeight: "600" }}>
                    £{subtotal.toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{ color: Colors.text.default }}>
                    Shipping
                  </Typography>
                  <Typography sx={{ fontWeight: "600" }}>
                    £{shippingFee.toFixed(2)}
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
                    <Typography sx={{ color: Colors.text.default }}>
                      Discount
                    </Typography>
                    <Typography sx={{ fontWeight: "600", color: "red" }}>
                      -£{discount.toFixed(2)}
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
                    £{total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="filled"
                disabled={!canPlaceOrder || isProcessing}
                onClick={handlePlaceOrder}
                sx={{
                  width: "100%",
                  fontWeight: "bold",
                  py: 1.5,
                  fontSize: "1rem",
                }}
              >
                {isProcessing ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: "white" }} />
                    Processing...
                  </Box>
                ) : paymentMethod === "CASH_ON_DELIVERY" ? (
                  "Place Order"
                ) : (
                  "Pay Now"
                )}
              </Button>

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  color: Colors.text.placeholder,
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: "1rem" }} />
                <Typography sx={{ fontSize: "0.85rem", fontWeight: "500" }}>
                  Secure Checkout - SSL Encrypted
                </Typography>
              </Box>
              <Typography
                sx={{ fontSize: "0.75rem", textAlign: "center", mt: 1 }}
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
