import { Box, Divider, IconButton, Typography } from "@mui/material";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Colors } from "../../../theme";
import { useAppSelector, useAppDispatch } from "../../../store/hooks/cartHooks";
import { removeItem, updateQuantity } from "../../../store/cartSlice";
import Button from "./Button";

const Cart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const handleIncrement = (dishId: string) => {
    const item = cartItems.find((item) => item._id === dishId);
    if (item) {
      dispatch(updateQuantity({ _id: dishId, quantity: item.quantity + 1 }));
    }
  };

  const handleDecrement = (dishId: string) => {
    const item = cartItems.find((item) => item._id === dishId);
    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ _id: dishId, quantity: item.quantity - 1 }));
    }
  };

  const handleRemove = (dishId: string) => {
    dispatch(removeItem(dishId));
  };

  if (cartItems.length === 0) {
    return (
      <Box
        sx={{
          marginTop: "2rem",
          mb: 2,
          marginLeft: "0.5rem",
          marginBottom: 6,
          maxHeight: "80vh",
          minHeight: "78vh",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "center",
          position: "sticky",
          top: "170px",
          zIndex: "90",
          borderRadius: "5px",
          border: `1px solid ${Colors.border.subtle}`,
          backgroundColor: Colors.background.defaultLight,
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
            Your Basket is Empty
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            width: "100%",
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
    );
  } else {
    return (
      <Box
        sx={{
          marginTop: "2rem",
          mb: 2,
          marginLeft: "0.5rem",
          marginBottom: 6,
          minHeight: "78vh",
          maxHeight: "78vh",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: "170px",
          zIndex: "90",
          borderRadius: "5px",
          border: `1px solid ${Colors.border.subtle}`,
          backgroundColor: Colors.background.defaultLight,
          overflow: "hidden",
        }}
      >
        {/* Cart Items */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
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
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    width: "90px",
                    height: "90px",
                    minWidth: "60px",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="/src/assets/images/salad.jpeg"
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      backgroundImage:
                        "url(/src/assets/svgs/placeholder-menu.svg)",
                      backgroundPosition: "center",
                      backgroundSize: "contain",
                    }}
                  />
                </Box>

                {/* Info */}
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
                      {item.name}
                    </Typography>
                    <IconButton
                      style={{ border: `1px solid ${Colors.border.subtle}` }}
                      size="small"
                      onClick={() => handleRemove(String(item._id))}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>

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
                      onClick={() => handleDecrement(String(item._id))}
                      sx={{
                        border: `1px solid ${Colors.border.subtle}`,
                        borderRadius: "4px",
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ minWidth: "20px", textAlign: "center" }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleIncrement(String(item._id))}
                      sx={{
                        border: `1px solid ${Colors.border.subtle}`,
                        borderRadius: "4px",
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Box>

        {/* Footer - stays fixed at bottom */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${Colors.border.subtle}`,
            flexShrink: 0,
          }}
        >
          <Button
            disabled={cartItems.length === 0}
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
        </Box>
      </Box>
    );
  }
};

export default Cart;
