import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Colors } from "../../../theme/colors";
import { Order } from "../../../types/order.types";

type OrderDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  order: Order | null;
};

const getStatusSteps = (status: string) => {
  const steps = [
    { key: "CONFIRMED", label: "Order confirmed", icon: CheckCircleIcon },
    { key: "PREPARING", label: "Restaurant preparing", icon: RestaurantIcon },
    { key: "ON_THE_WAY", label: "On the way", icon: LocalShippingIcon },
    { key: "DELIVERED", label: "Delivered", icon: CheckCircleIcon },
  ];

  const statusIndex = steps.findIndex((s) => s.key === status);

  return steps.map((step, index) => ({
    ...step,
    completed: index <= statusIndex,
    current: index === statusIndex,
  }));
};

const OrderDetailsModal = ({
  open,
  onClose,
  order,
}: OrderDetailsModalProps) => {
  if (!order) return null;

  const statusSteps = getStatusSteps(order.status);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: { xs: "10px", sm: "12px" },
          width: { xs: "calc(100vw - 24px)", sm: "600px" },
          maxWidth: "600px",
          maxHeight: { xs: "calc(100dvh - 24px)", sm: "85vh" },
          m: { xs: 1.5, sm: 4 },
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 0, m: 0, overflowY: "auto" }}>
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              borderBottom: `1px solid ${Colors.border.subtle}`,
            }}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              Order Details
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 2, pb: 0 }}>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "1.25rem",
                color: Colors.text.default,
              }}
            >
              {order.restaurantName}
            </Typography>
            <Typography
              sx={{ color: Colors.text.placeholder, fontSize: "0.9rem" }}
            >
              {formatDate(order.createdAt)} · {order.items.length} item
              {order.items.length > 1 ? "s" : ""}
            </Typography>
          </Box>

          <Box sx={{ px: 2, py: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              {statusSteps.map((step, index) => (
                <Box
                  key={step.key}
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: step.completed
                        ? Colors.background.brand
                        : Colors.border.subtle,
                      color: step.completed
                        ? Colors.text.inverse
                        : Colors.text.placeholder,
                      zIndex: 1,
                    }}
                  >
                    <step.icon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      color: step.current
                        ? Colors.background.brand
                        : step.completed
                          ? Colors.text.default
                          : Colors.text.placeholder,
                      fontWeight: step.current ? 600 : 400,
                      textAlign: "center",
                      mt: 0.5,
                    }}
                  >
                    {step.label}
                  </Typography>
                  {index < statusSteps.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: "50%",
                        width: "100%",
                        height: 2,
                        backgroundColor: step.completed
                          ? Colors.background.brand
                          : Colors.border.subtle,
                        zIndex: 0,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Typography
              sx={{ fontWeight: "bold", mb: 1.5, fontSize: "0.9rem" }}
            >
              items
            </Typography>
            {order.items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: "500",
                      color: Colors.text.default,
                      minWidth: 20,
                    }}
                  >
                    {item.quantity}x
                  </Typography>
                  <Typography sx={{ color: Colors.text.default }}>
                    {item.dishName}
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontWeight: "500", color: Colors.text.default }}
                >
                  £{item.lineTotal.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography sx={{ color: Colors.text.placeholder }}>
                Subtotal
              </Typography>
              <Typography>£{order.subtotal.toFixed(2)}</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography sx={{ color: Colors.text.placeholder }}>
                Delivery
              </Typography>
              <Typography>£{order.deliveryFee.toFixed(2)}</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography sx={{ color: Colors.text.placeholder }}>
                Service fee
              </Typography>
              <Typography>£{order.serviceFee.toFixed(2)}</Typography>
            </Box>
            {order.discountAmount > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography sx={{ color: "#4caf50" }}>Discount</Typography>
                <Typography sx={{ color: "#4caf50" }}>
                  -£{order.discountAmount.toFixed(2)}
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                Total
              </Typography>
              <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                £{order.totalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: "bold", mb: 1, fontSize: "0.9rem" }}>
              Delivery address
            </Typography>
            <Typography sx={{ color: Colors.text.placeholder }}>
              {order.deliveryAddress.line1}
            </Typography>
            {order.deliveryAddress.line2 && (
              <Typography sx={{ color: Colors.text.placeholder }}>
                {order.deliveryAddress.line2}
              </Typography>
            )}
            <Typography sx={{ color: Colors.text.placeholder }}>
              {order.deliveryAddress.city}, {order.deliveryAddress.postcode}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
