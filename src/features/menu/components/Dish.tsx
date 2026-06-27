import { Box, Card, Typography } from "@mui/material";
import { IDish } from "../../../data/Sides";
import { Colors } from "../../../theme";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/cartHooks";
import {
  addItemAndSync,
  clearCartAndSync,
  removeItemAndSync,
  updateQuantityAndSync,
} from "../../../store/cartSlice";
import { useState } from "react";
import { Link } from "react-router-dom";
import PopUpDialog from "./PopUpDialog";
import { showSuccessSnackbar } from "../../../utils/notifications";
import DishDetailsDialog from "./DishDetailsDialog";
import DishQuantityControl from "./DishQuantityControl";

type DishProps = {
  data: IDish;
};

const Dish = ({ data }: DishProps) => {
  const dispatch = useAppDispatch();
  const [isReplaceCartDialogOpen, setIsReplaceCartDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartRestaurantId = useAppSelector((state) => state.cart.restaurantId);
  const cartRestaurantName = useAppSelector(
    (state) => state.cart.restaurantName,
  );
  const cartItem = cartItems.find((item) => item._id === data._id);
  const quantity = cartItem?.quantity ?? 0;
  const cartItemId = cartItem?.cartItemId || cartItem?._id;
  const isInCart = quantity > 0;

  const handleAddToCart = async () => {
    const selectedRestaurantId = localStorage.getItem("selected-restaurant-id");

    if (
      cartItems.length > 0 &&
      cartRestaurantId &&
      selectedRestaurantId &&
      cartRestaurantId !== selectedRestaurantId
    ) {
      setIsReplaceCartDialogOpen(true);
      return;
    }

    await dispatch(addItemAndSync(data));
    showSuccessSnackbar(`${data.name} added to cart`);
  };

  const handleStartNewCart = async () => {
    setIsReplaceCartDialogOpen(false);
    await dispatch(clearCartAndSync());
    await dispatch(addItemAndSync(data));
    showSuccessSnackbar(`${data.name} added to cart`);
  };

  const handleRemoveFromCart = async () => {
    if (!cartItemId) {
      return;
    }

    await dispatch(removeItemAndSync(cartItemId));
  };

  const handleDecreaseQuantity = async () => {
    if (!cartItemId) {
      return;
    }

    if (quantity <= 1) {
      await handleRemoveFromCart();
      return;
    }

    await dispatch(
      updateQuantityAndSync({
        cartItemId,
        quantity: quantity - 1,
      }),
    );
  };

  const handleIncreaseQuantity = async () => {
    if (!cartItemId || quantity === 0) {
      await handleAddToCart();
      return;
    }

    await dispatch(
      updateQuantityAndSync({
        cartItemId,
        quantity: quantity + 1,
      }),
    );
  };

  return (
    <>
      <Card
        onClick={() => setIsDetailsOpen(true)}
        sx={{
          border: `1px solid ${Colors.border.default}`,
          borderRadius: "6px",
          overflow: "hidden",
          p: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "178px",
          width: "100%",
          maxWidth: "100%",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
          backgroundColor: Colors.background.light,
          cursor: "pointer",
          position: "relative",
          transition:
            "box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
          borderLeft: isInCart
            ? `6px solid ${Colors.background.brand}`
            : `1px solid ${Colors.border.default}`,
          "@media (hover: hover) and (pointer: fine)": {
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
            },
          },
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            flex: 1,
            alignSelf: "stretch",
            p: { xs: 2, md: 3 },
            pr: 1.5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1rem", md: "1.08rem" },
              mb: 0.5,
              color: Colors.text.default,
            }}
          >
            {data.name}
          </Typography>
          <Typography
            sx={{
              color: Colors.text.lighter,
              fontSize: { xs: "0.86rem", md: "0.92rem" },
              mb: 0.75,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {data.description}
          </Typography>
          <Typography
            sx={{
              color: Colors.text.lighter,
              fontSize: "0.9rem",
              mb: 0.5,
            }}
          >
            {Math.round(Number(data.price) * 100 + 420)} kcal
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.95rem",
              color: Colors.text.default,
            }}
          >
            £{parseFloat(data.price).toFixed(2)}
          </Typography>
        </Box>

        <Box
          sx={{
            width: { xs: 118, sm: 142 },
            height: { xs: 118, sm: 142 },
            flexShrink: 0,
            mr: { xs: 2.25, md: 3 },
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: { xs: 104, sm: 120 },
              height: { xs: 104, sm: 120 },
              borderRadius: "4px",
              overflow: "hidden",
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <img
              src={data.image}
              alt={data.name}
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                backgroundImage:
                  "url(https://assets.dilum.me/deliveroo-clone/svgs/placeholder-menu.svg)",
                backgroundPosition: "center",
                backgroundSize: "contain",
              }}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              right: { xs: -6, sm: -10 },
              bottom: { xs: 4, sm: 2 },
              zIndex: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <DishQuantityControl
              dishName={data.name}
              quantity={quantity}
              onAdd={handleAddToCart}
              onDecrease={handleDecreaseQuantity}
              onIncrease={handleIncreaseQuantity}
            />
          </Box>
        </Box>
      </Card>
      <DishDetailsDialog
        dish={data}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
      <PopUpDialog
        open={isReplaceCartDialogOpen}
        onClose={() => setIsReplaceCartDialogOpen(false)}
        onConfirm={() => void handleStartNewCart()}
        title="Start a new order?"
        confirmLabel="Start new order"
        cancelLabel="Keep current cart"
      >
        <Typography sx={{ color: Colors.text.default }}>
          Your cart contains items from{" "}
          <Link
            style={{
              color: Colors.background.brand,
              textDecoration: "none",
            }}
            to={`/restaurants/${cartRestaurantId}/menu`}
          >
            {cartRestaurantName || "another restaurant"}
          </Link>
          . Starting a new order will clear your current cart.
        </Typography>
      </PopUpDialog>
    </>
  );
};

export default Dish;
