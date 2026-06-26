import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IDish } from "../../../data/Sides";
import { Colors } from "../../../theme";
import Button from "./Button";
import PopUpDialog from "./PopUpDialog";
import {
  addItemAndSync,
  clearCartAndSync,
  updateQuantityAndSync,
} from "../../../store/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/cartHooks";
import { showSuccessSnackbar } from "../../../utils/notifications";

type DishDetailsDialogProps = {
  dish: IDish | null;
  open: boolean;
  onClose: () => void;
};

const DishDetailsDialog = ({ dish, open, onClose }: DishDetailsDialogProps) => {
  const dispatch = useAppDispatch();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isReplaceCartDialogOpen, setIsReplaceCartDialogOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartRestaurantId = useAppSelector((state) => state.cart.restaurantId);
  const cartRestaurantName = useAppSelector(
    (state) => state.cart.restaurantName,
  );

  const cartItem = cartItems.find((item) => item._id === dish?._id);
  const cartItemId = cartItem?.cartItemId || cartItem?._id;
  const cartQuantity = cartItem?.quantity ?? 0;

  useEffect(() => {
    if (!open || !dish) {
      return;
    }

    setSelectedQuantity(cartQuantity || 1);
  }, [cartQuantity, dish, open]);

  if (!dish) {
    return null;
  }

  const price = Number(dish.price);
  const total = Number.isFinite(price) ? price * selectedQuantity : 0;

  const addDishToCart = async () => {
    if (cartItemId) {
      await dispatch(
        updateQuantityAndSync({
          cartItemId,
          quantity: selectedQuantity,
        }),
      );
      showSuccessSnackbar(`${dish.name} quantity updated`);
      onClose();
      return;
    }

    for (let index = 0; index < selectedQuantity; index += 1) {
      await dispatch(addItemAndSync(dish));
    }

    showSuccessSnackbar(`${dish.name} added to cart`);
    onClose();
  };

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

    await addDishToCart();
  };

  const handleStartNewCart = async () => {
    setIsReplaceCartDialogOpen(false);
    await dispatch(clearCartAndSync());
    await addDishToCart();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "10px" },
            maxHeight: { xs: "100dvh", sm: "calc(100dvh - 64px)" },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 1.5,
            position: "absolute",
            right: 0,
            zIndex: 2,
          }}
        >
          <IconButton
            aria-label="Close dish details"
            onClick={onClose}
            sx={{
              backgroundColor: Colors.background.light,
              boxShadow: `0 2px 8px ${Colors.boxShadow.default}`,
              "&:hover": { backgroundColor: Colors.background.default },
            }}
          >
            <CloseIcon sx={{ color: Colors.background.brand }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              height: { xs: 260, sm: 340 },
              backgroundColor: Colors.background.default,
            }}
          >
            <img
              src={dish.image}
              alt={dish.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>

          <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Typography
              variant="h5"
              sx={{ color: Colors.text.default, fontWeight: 800, mb: 1 }}
            >
              {dish.name}
            </Typography>
            {dish.description && (
              <Typography sx={{ color: Colors.text.lighter, mb: 2 }}>
                {dish.description}
              </Typography>
            )}
            <Typography sx={{ color: Colors.text.default, fontWeight: 700 }}>
              £{price.toFixed(2)}
            </Typography>
          </Box>

          <Box
            sx={{
              borderTop: `1px solid ${Colors.border.default}`,
              p: { xs: 2, sm: 2.5 },
              position: "sticky",
              bottom: 0,
              backgroundColor: Colors.background.light,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              <IconButton
                aria-label="Decrease quantity"
                disabled={selectedQuantity === 1}
                onClick={() =>
                  setSelectedQuantity((current) => Math.max(1, current - 1))
                }
              >
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ fontWeight: 800, fontSize: "1.2rem" }}>
                {selectedQuantity}
              </Typography>
              <IconButton
                aria-label="Increase quantity"
                onClick={() => setSelectedQuantity((current) => current + 1)}
              >
                <AddIcon />
              </IconButton>
            </Box>

            <Button
              variant="filled"
              onClick={() => void handleAddToCart()}
              sx={{ width: "100%", py: 1.5, fontWeight: 800 }}
            >
              {cartItem ? "Update" : "Add"} for £{total.toFixed(2)}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

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

export default DishDetailsDialog;
