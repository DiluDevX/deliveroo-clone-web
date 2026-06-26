import { Box, Card, CardContent, Typography } from "@mui/material";
import Button from "./Button";
import { IDish } from "../../../data/Sides";
import AddIcon from "@mui/icons-material/Add";
import { Colors } from "../../../theme";
import { useState } from "react";
import { Link } from "react-router-dom";
import { addItemAndSync, clearCartAndSync } from "../../../store/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/cartHooks";
import { showSuccessSnackbar } from "../../../utils/notifications";
import PopUpDialog from "./PopUpDialog";
import DishDetailsDialog from "./DishDetailsDialog";

type SpecialCardProps = {
  data: IDish;
};

const SpecialCard = ({ data }: SpecialCardProps) => {
  const dispatch = useAppDispatch();
  const discountPercent = Number(data.discountPercent ?? 0);
  const [isReplaceCartDialogOpen, setIsReplaceCartDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartRestaurantId = useAppSelector((state) => state.cart.restaurantId);
  const cartRestaurantName = useAppSelector(
    (state) => state.cart.restaurantName,
  );

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

  return (
    <>
      <Card
        onClick={() => setIsDetailsOpen(true)}
        sx={{
          width: "100%",
          maxWidth: "170px",
          minWidth: "170px",
          height: "310px",
          mr: 2,
          my: 2,
          display: "flex",
          flexDirection: "column",
          overflow: "unset",
          backgroundColor: Colors.background.defaultLight,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "3px",
          borderWidth: 1.5,
          borderStyle: "solid",
          borderColor: Colors.border.default,
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
              fontSize: "0.72rem",
              fontWeight: 800,
              lineHeight: 1.05,
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
            {discountPercent}%
            <Box component="span" sx={{ display: "block", fontSize: "0.6rem" }}>
              off
            </Box>
          </Box>
        )}
        <img
          src={data.image}
          alt={data.name}
          style={{
            minHeight: 150,
            maxHeight: 150,
            width: "100%",
            borderRadius: "3px",
            objectFit: "cover",
            backgroundImage:
              "url(https://assets.dilum.me/deliveroo-clone/svgs/placeholder-menu.svg)",
            backgroundPosition: "center",
            backgroundSize: "contain",
          }}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            pt: 2.5,
            pb: 1,
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{ fontSize: "0.8rem" }}
            gutterBottom
            variant="h5"
            component="div"
          >
            {data.name}
          </Typography>
          {data.description && (
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
          <Typography sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
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
          <Button
            aria-label={`Add ${data.name} to cart`}
            onClick={(event) => {
              event.stopPropagation();
              void handleAddToCart();
            }}
            sx={{
              width: 48,
              height: 48,
              minHeight: 48,
              minWidth: 48,
              borderRadius: "50%",
              border: `1px solid ${Colors.border.default}`,
              backgroundColor: Colors.background.light,
              boxShadow: `0 3px 10px ${Colors.boxShadow.default}`,
              position: "absolute",
              right: 12,
              top: 126,
              p: 0,
            }}
          >
            <AddIcon
              sx={{
                height: "1.2rem",
                width: "1.2rem",
                color: Colors.text.default,
              }}
            />
          </Button>
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
