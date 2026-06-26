import { Box, Card, IconButton, Typography } from "@mui/material";
import { IDish } from "../../../data/Sides";
import Button from "./Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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

type DishProps = {
  data: IDish;
};

const Dish = ({ data }: DishProps) => {
  const dispatch = useAppDispatch();
  const [isReplaceCartDialogOpen, setIsReplaceCartDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isQuantityControlOpen, setIsQuantityControlOpen] = useState(false);
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

    setIsQuantityControlOpen(false);
    await dispatch(removeItemAndSync(cartItemId));
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
          boxShadow: `0px 2px 8px ${Colors.boxShadow.default}`,
          backgroundColor: Colors.background.light,
          cursor: "pointer",
          position: "relative",
          borderLeft: isInCart
            ? `6px solid ${Colors.background.brand}`
            : `1px solid ${Colors.border.default}`,
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
            width: { xs: 112, sm: 132 },
            height: { xs: 112, sm: 132 },
            flexShrink: 0,
            mr: { xs: 1.5, md: 2 },
            borderRadius: "4px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={data.image}
            alt={data.name}
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
          {!isInCart ? (
            <Button
              aria-label={`Add ${data.name} to cart`}
              onClick={(event) => {
                event.stopPropagation();
                void handleAddToCart();
              }}
              sx={{
                position: "absolute",
                right: -2,
                bottom: -2,
                width: 48,
                height: 48,
                minWidth: 48,
                minHeight: 48,
                borderRadius: "50%",
                backgroundColor: Colors.background.light,
                border: `1px solid ${Colors.border.default}`,
                boxShadow: `0 3px 10px ${Colors.boxShadow.default}`,
                p: 0,
              }}
            >
              <AddIcon sx={{ color: Colors.background.brand }} />
            </Button>
          ) : isQuantityControlOpen ? (
            <Box
              onClick={(event) => event.stopPropagation()}
              sx={{
                position: "absolute",
                right: -2,
                bottom: -2,
                height: 48,
                minWidth: 132,
                borderRadius: "999px",
                backgroundColor: Colors.background.light,
                border: `1px solid ${Colors.border.default}`,
                boxShadow: `0 3px 10px ${Colors.boxShadow.default}`,
                display: "grid",
                gridTemplateColumns: "44px 44px 44px",
                alignItems: "center",
                justifyItems: "center",
              }}
            >
              <IconButton
                aria-label={`Remove ${data.name} from cart`}
                onClick={() => void handleRemoveFromCart()}
                size="small"
              >
                <DeleteOutlineIcon sx={{ color: Colors.background.brand }} />
              </IconButton>
              <Typography sx={{ fontWeight: 800 }}>{quantity}</Typography>
              <IconButton
                aria-label={`Add one more ${data.name}`}
                onClick={() => void handleIncreaseQuantity()}
                size="small"
              >
                <AddIcon sx={{ color: Colors.background.brand }} />
              </IconButton>
            </Box>
          ) : (
            <Button
              aria-label={`${data.name} quantity ${quantity}`}
              onClick={(event) => {
                event.stopPropagation();
                setIsQuantityControlOpen(true);
              }}
              sx={{
                position: "absolute",
                right: -2,
                bottom: -2,
                width: 56,
                height: 56,
                minWidth: 56,
                minHeight: 56,
                borderRadius: "50%",
                backgroundColor: Colors.background.brand,
                color: Colors.text.inverse,
                border: "none",
                boxShadow: `0 3px 10px ${Colors.boxShadow.default}`,
                p: 0,
                fontWeight: 800,
                fontSize: "1.1rem",
                "&:hover": {
                  border: "none",
                  backgroundColor: Colors.background.brandHover,
                },
              }}
            >
              {quantity}
            </Button>
          )}
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
