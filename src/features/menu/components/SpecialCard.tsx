import { Box, Card, CardContent, Typography } from "@mui/material";
import { IDish } from "../../../data/Sides";
import { Colors } from "../../../theme";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  addItemAndSync,
  clearCartAndSync,
  removeItemAndSync,
  updateQuantityAndSync,
} from "../../../store/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/cartHooks";
import { showSuccessSnackbar } from "../../../utils/notifications";
import PopUpDialog from "./PopUpDialog";
import DishDetailsDialog from "./DishDetailsDialog";
import DishQuantityControl from "./DishQuantityControl";

type SpecialCardProps = {
  data: IDish;
  fillContainer?: boolean;
  compact?: boolean;
};

const SpecialCard = ({
  data,
  fillContainer = false,
  compact = false,
}: SpecialCardProps) => {
  const dispatch = useAppDispatch();
  const discountPercent = Number(data.discountPercent ?? 0);
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
  const cardWidth = fillContainer ? "100%" : { xs: 156, sm: 164, md: 170 };
  const cardHeight = compact ? 220 : { xs: 286, sm: 300, md: 310 };
  const imageHeight = compact ? 110 : { xs: 132, sm: 142, md: 150 };
  const quantityTop = compact ? 92 : { xs: 108, sm: 118, md: 126 };

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
          width: cardWidth,
          maxWidth: fillContainer ? "none" : "170px",
          minWidth: fillContainer ? 0 : cardWidth,
          height: cardHeight,
          mr: fillContainer ? 0 : 2,
          my: fillContainer ? 0 : 2,
          display: "flex",
          flexDirection: "column",
          overflow: "unset",
          backgroundColor: Colors.background.defaultLight,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "3px",
          borderWidth: 1.5,
          borderStyle: "solid",
          borderColor: Colors.border.default,
          borderBottom: isInCart
            ? `4px solid ${Colors.background.brand}`
            : `1.5px solid ${Colors.border.default}`,
          position: "relative",
          cursor: "pointer",
        }}
      >
        {discountPercent > 0 && (
          <Box
            aria-label={`${discountPercent}% off`}
            sx={{
              position: "absolute",
              top: -1.5,
              right: 8,
              zIndex: 2,
              minWidth: 44,
              px: 0.75,
              pt: 0.75,
              pb: 1.25,
              backgroundColor: Colors.background.brand,
              color: Colors.text.inverse,
              textAlign: "center",
              borderRadius: "0 0 4px 4px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.18)",
              "&::after": {
                content: '""',
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -9,
                margin: "auto",
                width: 0,
                height: 0,
                borderLeft: "22px solid transparent",
                borderRight: "22px solid transparent",
                borderTop: `9px solid ${Colors.background.brand}`,
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                display: "block",
                color: "inherit",
                fontFamily: "IBM Plex Sans, serif",
                fontSize: "0.95rem",
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {discountPercent}%
            </Typography>
            <Typography
              component="span"
              sx={{
                display: "block",
                color: "inherit",
                fontFamily: "IBM Plex Sans, serif",
                fontSize: "0.64rem",
                fontWeight: 800,
                lineHeight: 1.05,
              }}
            >
              off
            </Typography>
          </Box>
        )}
        <Box
          component="img"
          src={data.image}
          alt={data.name}
          loading="lazy"
          decoding="async"
          sx={{
            height: imageHeight,
            minHeight: imageHeight,
            width: "100%",
            borderRadius: "3px",
            objectFit: "cover",
            flexShrink: 0,
            backgroundImage:
              "url(https://assets.dilum.me/deliveroo-clone/svgs/placeholder-menu.svg)",
            backgroundPosition: "center",
            backgroundSize: "contain",
          }}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            pt: compact ? 2 : 2.5,
            pb: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              fontSize: compact ? "0.76rem" : "0.8rem",
              fontWeight: 800,
              display: "-webkit-box",
              WebkitLineClamp: compact ? 2 : 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            gutterBottom
            variant="h5"
            component="div"
          >
            {data.name}
          </Typography>
          {data.description && !compact && (
            <Typography
              sx={{
                color: Colors.text.lighter,
                fontSize: "0.72rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mb: 1,
              }}
            >
              {data.description}
            </Typography>
          )}
          {compact && (
            <Typography
              sx={{
                color: Colors.text.lighter,
                fontSize: "0.74rem",
                mt: "auto",
                mb: 0.75,
              }}
            >
              {Math.round(Number(data.price) * 100 + 420)} kcal
            </Typography>
          )}
          <Typography
            sx={{
              fontWeight: compact ? 500 : 700,
              fontSize: compact ? "0.78rem" : "0.85rem",
              mt: compact ? 0 : "auto",
            }}
          >
            £{Number(data.price).toFixed(2)}
          </Typography>
        </CardContent>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: compact ? 8 : 12,
              top: quantityTop,
            }}
          >
            <DishQuantityControl
              dishName={data.name}
              quantity={quantity}
              compact={compact}
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

export default SpecialCard;
