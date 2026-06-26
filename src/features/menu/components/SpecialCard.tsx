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

type SpecialCardProps = {
  data: IDish;
};

const SpecialCard = ({ data }: SpecialCardProps) => {
  const dispatch = useAppDispatch();
  const [isReplaceCartDialogOpen, setIsReplaceCartDialogOpen] = useState(false);
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
        sx={{
          width: "100%",
          maxWidth: "150px",
          height: "270px",
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
        }}
      >
        <img
          src={data.image}
          alt={data.name}
          style={{
            minHeight: 150,
            maxHeight: 150,
            width: "148px",
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
            maxHeight: "70px",
            mb: 1,
            WebkitLineClamp: 1,
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
          {Number(data.discountPercent ?? 0) > 0 && (
            <Typography
              sx={{
                color: Colors.background.brand,
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              {data.discountPercent}% off
            </Typography>
          )}
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
            onClick={handleAddToCart}
            sx={{
              width: "89%",
              borderRadius: "3px",
              border: "0.5px solid lightgrey",
              marginBottom: "0.5rem",
              position: "relative",
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
