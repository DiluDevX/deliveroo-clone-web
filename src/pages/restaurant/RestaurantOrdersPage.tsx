import {
  CancelOutlined,
  CheckCircleOutline,
  CurrencyExchangeOutlined,
  DeliveryDiningOutlined,
  HourglassEmptyOutlined,
  InfoOutlined,
  Inventory2Outlined,
  RestaurantOutlined,
  SearchOutlined,
  TaskAltOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Button from "../../features/menu/components/Button";
import {
  getRestaurantOrders,
  RestaurantOrderStatus,
  updateRestaurantOrderStatus,
} from "../../services/restaurant-admin.service";
import { useAppSelector } from "../../store/hooks/cartHooks";
import { Colors } from "../../theme";
import { Order } from "../../types/order.types";
import {
  showErrorSnackbar,
  showSuccessSnackbar,
} from "../../utils/notifications";

const DISH_IMAGE_FALLBACK =
  "https://assets.dilum.me/deliveroo-clone/svgs/NotFound.svg";

const NEXT_STATUS: Partial<
  Record<RestaurantOrderStatus, RestaurantOrderStatus>
> = {
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
};

const getNextStatus = (status: string): RestaurantOrderStatus | undefined => {
  switch (status) {
    case "CONFIRMED":
    case "PREPARING":
      return NEXT_STATUS[status];
    default:
      return undefined;
  }
};

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "success" as const;
    case "READY":
    case "OUT_FOR_DELIVERY":
      return "info" as const;
    case "PREPARING":
      return "warning" as const;
    case "CANCELLED":
    case "REFUNDED":
      return "error" as const;
    default:
      return "default" as const;
  }
};

const getUnavailableActionIcon = (status: string) => {
  const iconSx = { fontSize: 24 };

  switch (status) {
    case "PENDING":
      return (
        <HourglassEmptyOutlined
          sx={{ ...iconSx, color: Colors.status.pending.text }}
        />
      );
    case "CONFIRMED":
      return <CheckCircleOutline sx={{ ...iconSx, color: Colors.icon.info }} />;
    case "PREPARING":
      return (
        <RestaurantOutlined sx={{ ...iconSx, color: Colors.status.warning }} />
      );
    case "READY":
      return <Inventory2Outlined sx={{ ...iconSx, color: "info.main" }} />;
    case "OUT_FOR_DELIVERY":
      return (
        <DeliveryDiningOutlined
          sx={{ ...iconSx, color: Colors.status.onTheWay.text }}
        />
      );
    case "DELIVERED":
      return (
        <TaskAltOutlined
          sx={{ ...iconSx, color: Colors.status.delivered.text }}
        />
      );
    case "CANCELLED":
      return <CancelOutlined sx={{ ...iconSx, color: Colors.error.main }} />;
    case "REFUNDED":
      return (
        <CurrencyExchangeOutlined
          sx={{ ...iconSx, color: Colors.error.default }}
        />
      );
    default:
      return <InfoOutlined sx={{ ...iconSx, color: Colors.icon.info }} />;
  }
};

const RestaurantOrdersPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const restaurantId = user?.restaurantId;
  const canManageOrders =
    user?.role === "platform_admin" ||
    (user?.role === "restaurant_user" &&
      Boolean(
        user.restaurantRole &&
          ["employee", "super_admin", "admin"].includes(user.restaurantRole),
      ));

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadOrders = async () => {
      if (!restaurantId) {
        if (isActive) setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setHasLoadError(false);
      try {
        const result = await getRestaurantOrders(restaurantId, page, 10);
        if (!isActive) return;

        setOrders(result.orders);
        setTotalPages(Math.max(result.totalPages, 1));
      } catch {
        if (!isActive) return;

        setHasLoadError(true);
        showErrorSnackbar("Failed to load restaurant orders");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadOrders();

    return () => {
      isActive = false;
    };
  }, [page, restaurantId]);

  const filteredOrders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return orders;

    return orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(search) ||
        order.status.toLowerCase().includes(search) ||
        order.userId.toLowerCase().includes(search) ||
        order.items.some((item) =>
          item.dishName.toLowerCase().includes(search),
        ),
    );
  }, [orders, searchTerm]);

  const handleAdvanceStatus = async (order: Order) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus || !canManageOrders || updatingOrderId) return;

    setUpdatingOrderId(order.id);
    try {
      const updatedOrder = await updateRestaurantOrderStatus(
        order.id,
        nextStatus,
      );
      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.id === updatedOrder.id ? updatedOrder : currentOrder,
        ),
      );
      setSelectedOrder((currentOrder) =>
        currentOrder?.id === updatedOrder.id ? updatedOrder : currentOrder,
      );
      showSuccessSnackbar(`Order marked ${formatStatus(nextStatus)}`);
    } catch {
      showErrorSnackbar("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (!restaurantId) {
    return (
      <Card sx={{ p: 4, border: `1px solid ${Colors.border.default}` }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Restaurant assignment missing
        </Typography>
        <Typography sx={{ color: Colors.text.lighter }}>
          This account must be assigned to a restaurant before viewing orders.
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
          Orders
        </Typography>
        <Typography sx={{ color: Colors.text.lighter }}>
          Review incoming orders and move them through kitchen preparation.
        </Typography>
      </Box>

      <Card
        sx={{
          p: 2,
          mb: 3,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by order number, status, user, or dish"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          InputProps={{
            startAdornment: (
              <SearchOutlined sx={{ mr: 1, color: Colors.text.placeholder }} />
            ),
          }}
          size="small"
        />
      </Card>

      <Card
        sx={{
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
            <CircularProgress sx={{ color: Colors.background.brand }} />
          </Box>
        ) : (
          <>
            <TableContainer sx={{ overflowX: "hidden" }}>
              <Table
                sx={{
                  width: "100%",
                  tableLayout: "fixed",
                  "& .MuiTableCell-root:not(:last-of-type)": {
                    borderRight: `1px solid ${Colors.border.default}`,
                  },
                  "& .MuiTableCell-root": {
                    px: { xs: 1, lg: 2 },
                  },
                }}
              >
                <TableHead>
                  <TableRow sx={{ bgcolor: Colors.background.default }}>
                    <TableCell sx={{ width: { xs: "25%", lg: "16%" } }}>
                      Order
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "10%",
                        display: { xs: "none", lg: "table-cell" },
                      }}
                    >
                      Customer
                    </TableCell>
                    <TableCell sx={{ width: { xs: "10%", lg: "7%" } }}>
                      Items
                    </TableCell>
                    <TableCell sx={{ width: { xs: "15%", lg: "9%" } }}>
                      Total
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "11%",
                        display: { xs: "none", lg: "table-cell" },
                      }}
                    >
                      Payment
                    </TableCell>
                    <TableCell sx={{ width: { xs: "20%", lg: "13%" } }}>
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "19%",
                        display: { xs: "none", lg: "table-cell" },
                      }}
                    >
                      Placed
                    </TableCell>
                    <TableCell sx={{ width: { xs: "30%", lg: "15%" } }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const nextStatus = getNextStatus(order.status);

                    return (
                      <TableRow
                        key={order.id}
                        hover
                        tabIndex={0}
                        aria-label={`View order ${order.orderNumber}`}
                        onClick={() => setSelectedOrder(order)}
                        onKeyDown={(event) => {
                          if (event.target !== event.currentTarget) return;
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedOrder(order);
                          }
                        }}
                        sx={{
                          cursor: "pointer",
                          "&:focus-visible": {
                            outline: `2px solid ${Colors.background.brand}`,
                            outlineOffset: -2,
                          },
                        }}
                      >
                        <TableCell
                          title={order.orderNumber}
                          sx={{
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {order.orderNumber}
                        </TableCell>
                        <TableCell
                          title={order.userId}
                          sx={{
                            display: { xs: "none", lg: "table-cell" },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {order.userId.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          {order.items.reduce(
                            (total, item) => total + item.quantity,
                            0,
                          )}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell
                          sx={{ display: { xs: "none", lg: "table-cell" } }}
                        >
                          {formatStatus(order.paymentStatus)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={formatStatus(order.status)}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell
                          title={formatDateTime(order.createdAt)}
                          sx={{
                            display: { xs: "none", lg: "table-cell" },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {formatDateTime(order.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              width: "100%",
                            }}
                          >
                            {canManageOrders && nextStatus && (
                              <Button
                                variant="filled"
                                disabled={Boolean(updatingOrderId)}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  void handleAdvanceStatus(order);
                                }}
                                sx={{
                                  width: "100%",
                                  maxWidth: 142,
                                  minHeight: 36,
                                  px: 1,
                                  fontSize: "0.8rem",
                                  fontWeight: 700,
                                }}
                              >
                                {updatingOrderId === order.id
                                  ? "Updating..."
                                  : `Mark ${formatStatus(nextStatus)}`}
                              </Button>
                            )}
                            {(!canManageOrders || !nextStatus) && (
                              <Tooltip
                                title={`${formatStatus(order.status)} - no restaurant action available`}
                                arrow
                              >
                                <Box
                                  component="span"
                                  role="img"
                                  aria-label={`${formatStatus(order.status)} - no restaurant action available`}
                                  sx={{
                                    width: 36,
                                    height: 36,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {getUnavailableActionIcon(order.status)}
                                </Box>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {!hasLoadError && filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Box sx={{ py: 5, textAlign: "center" }}>
                          <Typography sx={{ fontWeight: 800, mb: 0.5 }}>
                            No orders found
                          </Typography>
                          <Typography sx={{ color: Colors.text.lighter }}>
                            New restaurant orders will appear here.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                  {hasLoadError && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Box sx={{ py: 5, textAlign: "center" }}>
                          <Typography sx={{ fontWeight: 800, mb: 0.5 }}>
                            Orders unavailable
                          </Typography>
                          <Typography sx={{ color: Colors.text.lighter }}>
                            The order service could not load this
                            restaurant&apos;s orders.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <Box
                sx={{
                  p: 2,
                  borderTop: `1px solid ${Colors.border.default}`,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  page={page}
                  count={totalPages}
                  onChange={(_, nextPage) => setPage(nextPage)}
                />
              </Box>
            )}
          </>
        )}
      </Card>

      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "8px" } }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>
          {selectedOrder?.orderNumber}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Chip
                  label={formatStatus(selectedOrder.status)}
                  color={getStatusColor(selectedOrder.status)}
                  size="small"
                />
                <Typography sx={{ fontWeight: 900 }}>
                  {formatCurrency(selectedOrder.totalAmount)}
                </Typography>
              </Box>
              <Divider />
              {selectedOrder.items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      component="img"
                      src={item.dishImageUrl || DISH_IMAGE_FALLBACK}
                      alt={item.dishName}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = DISH_IMAGE_FALLBACK;
                      }}
                      sx={{
                        width: 48,
                        height: 48,
                        flexShrink: 0,
                        objectFit: "cover",
                        borderRadius: 1,
                        border: `1px solid ${Colors.border.default}`,
                        bgcolor: Colors.background.default,
                      }}
                    />
                    <Typography sx={{ overflowWrap: "anywhere" }}>
                      {item.quantity} × {item.dishName}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(item.lineTotal)}
                  </Typography>
                </Box>
              ))}
              <Divider />
              <Typography sx={{ fontWeight: 800 }}>Delivery address</Typography>
              <Typography sx={{ color: Colors.text.lighter }}>
                {selectedOrder.deliveryAddress.line1}
                {selectedOrder.deliveryAddress.line2
                  ? `, ${selectedOrder.deliveryAddress.line2}`
                  : ""}
                , {selectedOrder.deliveryAddress.city},{" "}
                {selectedOrder.deliveryAddress.postcode}
              </Typography>
              {selectedOrder.deliveryAddress.instructions && (
                <Typography sx={{ color: Colors.text.lighter }}>
                  Instructions: {selectedOrder.deliveryAddress.instructions}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="border"
            onClick={() => setSelectedOrder(null)}
            sx={{ px: 2, fontWeight: 700 }}
          >
            Close
          </Button>
          {selectedOrder &&
            canManageOrders &&
            getNextStatus(selectedOrder.status) && (
              <Button
                variant="filled"
                disabled={Boolean(updatingOrderId)}
                onClick={() => void handleAdvanceStatus(selectedOrder)}
                sx={{ px: 2, fontWeight: 700 }}
              >
                {updatingOrderId === selectedOrder.id
                  ? "Updating..."
                  : `Mark ${formatStatus(
                      getNextStatus(selectedOrder.status) ??
                        selectedOrder.status,
                    )}`}
              </Button>
            )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantOrdersPage;
