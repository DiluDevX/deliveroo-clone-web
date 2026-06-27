import { useState } from "react";
import { Box, Typography, IconButton, Divider } from "@mui/material";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Colors } from "../../../theme";
import { useAppSelector, useAppDispatch } from "../../../store/hooks/cartHooks";
import {
  clearCartAndSync,
  removeItemAndSync,
  updateQuantityAndSync,
} from "../../../store/cartSlice";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import PopUpDialog from "./PopUpDialog";

type CartProps = {
  layout?: "sidebar" | "drawer";
};

const Cart = ({ layout = "sidebar" }: CartProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.items);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const isDrawer = layout === "drawer";

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0,
  );

  const getCartItemActionId = (item: { cartItemId?: string; _id: string }) =>
    item.cartItemId || item._id;

  const handleIncrement = (itemId: string) => {
    const item = cartItems.find(
      (item) => item.cartItemId === itemId || item._id === itemId,
    );
    if (item) {
      dispatch(
        updateQuantityAndSync({
          cartItemId: itemId,
          quantity: item.quantity + 1,
        }),
      );
    }
  };

  const handleDecrement = (itemId: string) => {
    const item = cartItems.find(
      (item) => item.cartItemId === itemId || item._id === itemId,
    );
    if (item && item.quantity > 1) {
      dispatch(
        updateQuantityAndSync({
          cartItemId: itemId,
          quantity: item.quantity - 1,
        }),
      );
    }
  };

  const handleRemove = (itemId: string) => {
    dispatch(removeItemAndSync(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCartAndSync());
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    // Navigate to checkout page
    navigate("/checkout");
  };

  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    // Store the intended destination for after login
    sessionStorage.setItem("redirectAfterLogin", "/checkout");
    navigate("/account/login");
  };

  const containerSx = {
    marginTop: isDrawer ? 0 : "2rem",
    mb: isDrawer ? 0 : 2,
    marginLeft: isDrawer ? 0 : "0.5rem",
    marginBottom: isDrawer ? 0 : 6,
    minHeight: isDrawer ? "auto" : "78vh",
    maxHeight: isDrawer ? "82vh" : "78vh",
    display: "flex",
    flexDirection: "column",
    position: isDrawer ? "relative" : "sticky",
    top: isDrawer ? "auto" : "170px",
    zIndex: isDrawer ? "auto" : "90",
    borderRadius: isDrawer ? "16px 16px 0 0" : "5px",
    border: isDrawer ? "none" : `1px solid ${Colors.border.subtle}`,
    backgroundColor: Colors.background.defaultLight,
    overflow: "hidden",
    width: "100%",
    "::-webkit-scrollbar": {
      display: "none",
    },
  } as const;

  // Login Dialog Component
  const LoginDialog = () => (
    <PopUpDialog
      open={showLoginDialog}
      onClose={() => setShowLoginDialog(false)}
      onConfirm={handleLoginRedirect}
      title="Login Required"
      description="Please log in to proceed with your order."
      confirmLabel="Log In"
      cancelLabel="Continue Shopping"
      actionsDirection="column"
      maxWidth="400px"
      paperSx={{ p: 1 }}
    />
  );

  if (cartItems.length === 0) {
    return (
      <>
        <LoginDialog />
        <Box
          sx={{
            ...containerSx,
            maxHeight: isDrawer ? "70vh" : "80vh",
            minHeight: isDrawer ? "360px" : "78vh",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <ShoppingBasketOutlinedIcon
              sx={{ height: "90px", width: "90px", color: Colors.text.light }}
            />
            <Typography sx={{ color: Colors.text.light, fontWeight: "bold" }}>
              Cart is empty
            </Typography>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              width: "100%",
              borderTop: `1px solid ${Colors.border.subtle}`,
              marginTop: "auto",
            }}
          >
            <Button
              disabled={cartItems.length === 0}
              sx={{
                width: "100%",
                fontWeight: "bold",
                textTransform: "none",
                py: 1.5,
              }}
            >
              Go to Checkout
            </Button>
          </Box>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <LoginDialog />
        <Box sx={containerSx}>
          {/* Cart Items */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: isDrawer ? 2.5 : 2,
              "::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {cartItems.map((item) => (
              <Box key={item._id} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {/* Image */}
                  <Box
                    sx={{
                      width: "100px",
                      height: "100px",
                      minWidth: "60px",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>

                  {/* Info */}
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
                      {item.name}
                    </Typography>

                    <Typography
                      sx={{ color: Colors.text.default, fontSize: "0.85rem" }}
                    >
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </Typography>

                    {/* Quantity Controls */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDecrement(getCartItemActionId(item))
                        }
                        sx={{
                          border: `1px solid ${Colors.border.subtle}`,
                          borderRadius: "4px",
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        sx={{ minWidth: "20px", textAlign: "center" }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleIncrement(getCartItemActionId(item))
                        }
                        sx={{
                          border: `1px solid ${Colors.border.subtle}`,
                          borderRadius: "4px",
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(getCartItemActionId(item))}
                    sx={{ alignSelf: "center" }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${Colors.border.subtle}`,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Total</Typography>
              <Typography sx={{ fontWeight: "bold" }}>
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
            <Button
              onClick={handleCheckout}
              variant="filled"
              sx={{
                width: "100%",
                fontWeight: "bold",
                textTransform: "none",
                py: 1.5,
              }}
            >
              Go to Checkout
            </Button>
            <Button
              onClick={handleClearCart}
              variant="border"
              sx={{
                width: "100%",
                mt: 1,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Clear Cart
            </Button>
          </Box>
        </Box>
      </>
    );
  }
};

export default Cart;
