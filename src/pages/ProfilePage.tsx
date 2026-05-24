import {
  Box,
  Typography,
  Card,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Colors } from "../theme/colors";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "../features/menu/components/Button";
import OrderDetailsModal from "../features/menu/components/OrderDetailsModal";
import TextInput from "../features/menu/components/TextInput";
import ClickableSwitch from "../features/menu/components/ClickableSwitch";
import { useAppSelector, useAppDispatch } from "../store/hooks/cartHooks";
import {
  createUserAddress,
  deleteUserAddress,
  getUserAddresses,
  getUserProfile,
  setDefaultUserAddress,
  deleteUserAccount,
  updateUserAddress,
  updateUserProfile,
  updatePassword,
} from "../services/user.service";
import {
  deletePaymentMethod,
  getUserPaymentMethods,
  setDefaultPaymentMethod,
} from "../services/payment.service";
import { getOrderHistory } from "../services/order.service";
import { Order } from "../types/order.types";
import { Address } from "../types/user.types";
import { UserPaymentMethod } from "../types/payment.types";

const DUMMY_ADDRESSES: Address[] = [
  {
    id: "addr_1",
    label: "Home",
    line1: "123 Main Street",
    line2: "Flat 4B",
    city: "London",
    postcode: "SW1A 1AA",
    country: "UK",
    instructions: "Ring the bell twice",
    isDefault: true,
  },
  {
    id: "addr_2",
    label: "Work",
    line1: "45 Office Tower",
    city: "London",
    postcode: "EC2A 1AB",
    country: "UK",
    isDefault: false,
  },
];

import { setCredentials } from "../store/authSlice";
import { logOutUser } from "../store/authThunks";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockIcon from "@mui/icons-material/Lock";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  BikeScooter,
  CancelRounded,
  CheckCircle,
  LockClock,
  RestaurantMenu,
  ShoppingBag,
} from "@mui/icons-material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentModal from "../features/menu/components/PaymentModal";
import AddressModal from "../features/menu/components/AddressModal";
import PopUpDialog from "../features/menu/components/PopUpDialog";
import { showErrorSnackbar, showSuccessSnackbar } from "../utils/notifications";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
});

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string>("Personal details");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [dummyAddresses, setDummyAddresses] =
    useState<Address[]>(DUMMY_ADDRESSES);
  const [payments, setPayments] = useState<UserPaymentMethod[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] =
    useState<UserPaymentMethod | null>(null);
  const [isDeletingPaymentMethod, setIsDeletingPaymentMethod] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: false,
  });
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null,
  );
  const [addressesLoading, setAddressesLoading] = useState(false);

  useEffect(() => {
    if (location.state?.selectedItem) {
      setSelectedItem(location.state.selectedItem);
    }
  }, [location]);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setAddressesLoading(true);
      const profile = await getUserProfile();
      if (profile) {
        dispatch(
          setCredentials({
            user: {
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email,
              phone: profile.phone,
              role: profile.role,
            },
          }),
        );
      }
      setPaymentsLoading(true);
      try {
        const savedPaymentMethods = await getUserPaymentMethods();
        setPayments(savedPaymentMethods);
      } finally {
        setPaymentsLoading(false);
      }
      setAddresses([]);
      setIsLoading(false);
      setAddressesLoading(false);
    };
    loadProfile();
  }, [dispatch]);

  useEffect(() => {
    if (selectedItem === "Order history") {
      loadOrders();
    }
  }, [selectedItem]);

  const loadOrders = async () => {
    setOrdersLoading(true);
    const orderList = await getOrderHistory();
    setOrders(orderList);
    setOrdersLoading(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    const success = await deleteUserAccount();
    setIsDeletingAccount(false);

    if (success) {
      setShowDeleteAccountDialog(false);
      dispatch(logOutUser());
      navigate("/");
    } else {
      setError("Failed to delete account");
    }
  };

  const handleLogout = () => {
    dispatch(logOutUser());
    navigate("/");
  };

  const canResumeCardPayment = (order: Order) => {
    if (
      order.status !== "PENDING" ||
      order.paymentMethod !== "card" ||
      !["PENDING", "PROCESSING"].includes(order.paymentStatus) ||
      !order.paymentExpiresAt
    ) {
      return false;
    }

    return new Date(order.paymentExpiresAt).getTime() > Date.now();
  };

  const handleResumeCardPayment = (order: Order) => {
    navigate("/payment", {
      state: {
        paymentMethod: "CARD",
        deliveryMethod: "delivery",
        order,
      },
    });
  };

  const refreshAddresses = async () => {
    setAddressesLoading(true);
    setAddresses(await getUserAddresses());
    setAddressesLoading(false);
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    const updatedAddress = await setDefaultUserAddress(addressId);
    if (!updatedAddress) {
      setError("Failed to update default address");
      return;
    }

    await refreshAddresses();
  };

  const handleDeleteAddress = async (addressId: string) => {
    setDeletingAddressId(addressId);
    setShowDeleteConfirmDialog(true);
  };

  const confirmDeleteAddress = async () => {
    if (!deletingAddressId) return;

    const success = await deleteUserAddress(deletingAddressId);
    if (!success) {
      setError("Failed to remove address");
      setShowDeleteConfirmDialog(false);
      setDeletingAddressId(null);
      return;
    }

    await refreshAddresses();
    setShowDeleteConfirmDialog(false);
    setDeletingAddressId(null);
  };

  const handleSaveAddress = async (address: {
    label: string;
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    instructions?: string;
  }) => {
    const savedAddress = editingAddress
      ? await updateUserAddress(editingAddress.id, address)
      : await createUserAddress({ ...address, country: "UK" });

    if (!savedAddress) {
      setError("Failed to save address");
      return false;
    }

    await refreshAddresses();
    setEditingAddress(null);
    return true;
  };

  const loadPaymentMethods = async () => {
    setPaymentsLoading(true);
    try {
      const savedPaymentMethods = await getUserPaymentMethods();
      setPayments(savedPaymentMethods);
      setAddresses([]);
    } finally {
      setPaymentsLoading(false);
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    const updatedPaymentMethod = await setDefaultPaymentMethod(paymentMethodId);

    if (!updatedPaymentMethod) {
      setError("Failed to update default payment method");
      showErrorSnackbar("Failed to update default payment method");
      return;
    }

    setPayments((currentPayments) =>
      currentPayments.map((payment) => ({
        ...payment,
        isDefault: payment.id === paymentMethodId,
      })),
    );
    showSuccessSnackbar("Default payment method updated");
  };

  const handleDeletePaymentMethod = async () => {
    if (!paymentMethodToDelete) {
      return;
    }

    setIsDeletingPaymentMethod(true);
    const deleted = await deletePaymentMethod(paymentMethodToDelete.id);

    if (!deleted) {
      setError("Failed to delete payment method");
      showErrorSnackbar("Failed to delete payment method");
      setIsDeletingPaymentMethod(false);
      return;
    }

    await loadPaymentMethods();
    setPaymentMethodToDelete(null);
    setIsDeletingPaymentMethod(false);
    showSuccessSnackbar("Payment method deleted");
  };

  const menuItems = [
    { icon: PersonIcon, label: "Personal details" },
    { icon: ShoppingBag, label: "Order history" },
    { icon: LocationOnIcon, label: "Saved addresses" },
    { icon: CreditCardIcon, label: "Payments" },
    { icon: LockIcon, label: "Password" },
    { icon: NotificationsIcon, label: "Notifications" },
    { icon: DeleteIcon, label: "Delete account", danger: true },
  ];

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
    mode: "onChange",
  });

  const {
    control,
    formState: { isValid },
  } = form;

  const handleSave = form.handleSubmit(async (data) => {
    setIsLoading(true);
    setError(null);

    const updated = await updateUserProfile(data);

    if (updated) {
      dispatch(
        setCredentials({
          user: {
            firstName: updated.firstName,
            lastName: updated.lastName,
            email: updated.email,
            phone: updated.phone,
            role: updated.role,
          },
        }),
      );
      setIsEditing(false);
    } else {
      setError("Failed to update profile");
    }

    setIsLoading(false);
  });

  const renderRightContent = () => {
    switch (selectedItem) {
      case "Personal details":
        return (
          <Card
            sx={{
              p: 3,
              borderRadius: "12px",
              border: `1px solid ${Colors.border.subtle}`,
              boxShadow: "none",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Personal Details
              </Typography>
              {!isEditing && (
                <IconButton onClick={() => setIsEditing(true)}>
                  <EditIcon sx={{ color: Colors.background.brand }} />
                </IconButton>
              )}
            </Box>

            {!isEditing && (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    sx={{ color: Colors.text.placeholder, fontSize: "0.85rem" }}
                  >
                    Name
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 600, color: Colors.text.default }}
                  >
                    {user?.firstName} {user?.lastName}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    sx={{ color: Colors.text.placeholder, fontSize: "0.85rem" }}
                  >
                    Email
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 600, color: Colors.text.default }}
                  >
                    {user?.email}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{ color: Colors.text.placeholder, fontSize: "0.85rem" }}
                  >
                    Phone
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 600, color: Colors.text.default }}
                  >
                    {user?.phone || "Not set"}
                  </Typography>
                </Box>
              </Box>
            )}

            {isEditing && (
              <>
                {error && (
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      backgroundColor: Colors.error.light,
                      borderRadius: "8px",
                    }}
                  >
                    <Typography sx={{ color: Colors.background.danger }}>
                      {error}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextInput
                            {...field}
                            fullWidth
                            label="First Name"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextInput
                            {...field}
                            fullWidth
                            label="Last Name"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextInput
                            {...field}
                            fullWidth
                            label="Email"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextInput
                            {...field}
                            fullWidth
                            label="Phone"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Button
                    variant="filled"
                    onClick={handleSave}
                    disabled={!isValid || isLoading}
                    sx={{ flex: 1 }}
                  >
                    {isLoading ? "Saving..." : "Save changes"}
                  </Button>
                  <Button
                    variant="border"
                    onClick={() => setIsEditing(false)}
                    sx={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            )}
          </Card>
        );

      case "Order history": {
        const getOrderStatusColor = (status: string) => {
          switch (status) {
            case "DELIVERED":
              return {
                bg: Colors.status.delivered.bg,
                color: Colors.status.delivered.text,
              };
            case "CANCELLED":
            case "REFUNDED":
              return {
                bg: Colors.status.cancelled.bg,
                color: Colors.status.cancelled.text,
              };
            case "ON_THE_WAY":
              return {
                bg: Colors.status.onTheWay.bg,
                color: Colors.status.onTheWay.text,
              };
            case "CONFIRMED":
              return {
                bg: `${Colors.background.brand}20`,
                color: Colors.background.brand,
              };
            case "PREPARING":
            case "PENDING":
              return {
                bg: Colors.status.pending.bg,
                color: Colors.status.pending.text,
              };
            default:
              return {
                bg: Colors.status.default.bg,
                color: Colors.status.default.text,
              };
          }
        };

        const getOrderStatusIcon = (status: string) => {
          switch (status) {
            case "DELIVERED":
              return <CheckCircle />;
            case "CANCELLED":
            case "REFUNDED":
              return <CancelRounded />;
            case "ON_THE_WAY":
              return <BikeScooter />;
            case "CONFIRMED":
              return <CheckCircle />;
            case "PREPARING":
            case "PENDING":
              return <RestaurantMenu />;
            default:
              return <LockClock />;
          }
        };

        const formatOrderDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        };

        const getItemSummary = (items: Order["items"]) => {
          if (items.length === 1) return items[0].dishName;
          if (items.length === 2)
            return `${items[0].dishName} & ${items[1].dishName}`;
          return `${items[0].dishName} +${items.length - 1} more`;
        };

        return (
          <Card
            sx={{
              p: 3,
              borderRadius: "12px",
              border: `1px solid ${Colors.border.subtle}`,
              boxShadow: "none",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Order History
              </Typography>
              {orders.length === 0 && (
                <Button variant="filled" sx={{ fontSize: "0.85rem", py: 0.5 }}>
                  Browse Restaurants
                </Button>
              )}
            </Box>

            {ordersLoading ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      gap: 2,
                      p: 2,
                      border: `1px solid ${Colors.border.subtle}`,
                      borderRadius: 2,
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={80}
                      sx={{ borderRadius: 1 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Skeleton variant="text" width="50%" height={24} />
                        <Skeleton
                          variant="rectangular"
                          width={80}
                          height={24}
                          sx={{ borderRadius: 2 }}
                        />
                      </Box>
                      <Skeleton
                        variant="text"
                        width="80%"
                        height={20}
                        sx={{ mb: 0.5 }}
                      />
                      <Skeleton variant="text" width="70%" height={20} />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : orders.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <ReceiptLongIcon
                  sx={{ fontSize: 48, color: Colors.text.placeholder, mb: 2 }}
                />
                <Typography sx={{ color: Colors.text.placeholder }}>
                  No orders yet
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxHeight: "600px",
                  overflow: "auto",
                }}
              >
                {orders.map((order) => {
                  const statusColors = getOrderStatusColor(order.status);
                  return (
                    <Box
                      key={order.id}
                      sx={{
                        display: "flex",
                        gap: 2,
                        p: 2,
                        border: `1px solid ${Colors.border.subtle}`,
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          overflow: "hidden",
                          flexShrink: 0,
                          backgroundColor: Colors.background.default,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {order.items[0]?.dishImageUrl ? (
                          <Box
                            component="img"
                            src={order.items[0].dishImageUrl}
                            alt={order.restaurantName}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Box
                            component="img"
                            src="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400"
                            alt={order.restaurantName}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: "1rem",
                              color: Colors.text.default,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {order.restaurantName}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              px: 1.5,
                              py: 0.25,
                              borderRadius: "20px",
                              backgroundColor: statusColors.bg,
                              flexShrink: 0,
                            }}
                          >
                            <Box
                              sx={{
                                fontSize: "0.9rem",
                                color: statusColors.color,
                              }}
                            >
                              {getOrderStatusIcon(order.status)}
                            </Box>
                            <Typography
                              sx={{
                                fontWeight: "600",
                                fontSize: "0.7rem",
                                color: statusColors.color,
                              }}
                            >
                              {order.status === "DELIVERED"
                                ? "Delivered"
                                : order.status === "ON_THE_WAY"
                                  ? "On the way"
                                  : order.status === "PREPARING"
                                    ? "Preparing"
                                    : order.status === "CONFIRMED"
                                      ? "Confirmed"
                                      : order.status === "PENDING"
                                        ? "Pending"
                                        : order.status === "CANCELLED"
                                          ? "Cancelled"
                                          : order.status.replace("_", " ")}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          sx={{
                            color: Colors.text.placeholder,
                            fontSize: "0.85rem",
                            mb: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getItemSummary(order.items)}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: Colors.text.placeholder,
                              fontSize: "0.8rem",
                            }}
                          >
                            {formatOrderDate(order.createdAt)}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color: Colors.text.default,
                            }}
                          >
                            £{order.totalAmount.toFixed(2)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                          <Button
                            variant="border"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            sx={{ flex: 1, fontSize: "0.85rem" }}
                          >
                            View Details
                          </Button>
                          {canResumeCardPayment(order) && (
                            <Button
                              variant="filled"
                              onClick={() => handleResumeCardPayment(order)}
                              sx={{ flex: 1, fontSize: "0.85rem" }}
                            >
                              Pay now
                            </Button>
                          )}
                          {order.status === "DELIVERED" && (
                            <Button
                              variant="filled"
                              onClick={() =>
                                navigate(`/restaurant/${order.restaurantId}`)
                              }
                              sx={{ flex: 1, fontSize: "0.85rem" }}
                            >
                              Reorder
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Card>
        );
      }

      case "Saved addresses":
        return (
          <Card
            sx={{
              p: 3,
              borderRadius: "12px",
              border: `1px solid ${Colors.border.subtle}`,
              boxShadow: "none",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Saved Addresses
              </Typography>
              <Button
                variant="filled"
                sx={{ fontSize: "0.85rem", py: 0.5 }}
                onClick={() => {
                  setEditingAddress(null);
                  setShowAddressModal(true);
                }}
              >
                <AddIcon sx={{ mr: 0.5 }} /> Add New
              </Button>
            </Box>
            {addressesLoading ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Skeleton
                        variant="text"
                        width="40%"
                        height={24}
                        sx={{ mb: 1 }}
                      />
                      <Skeleton
                        variant="text"
                        width="80%"
                        height={20}
                        sx={{ mb: 0.5 }}
                      />
                      <Skeleton variant="text" width="60%" height={20} />
                    </Box>
                    <Skeleton variant="rectangular" width={80} height={32} />
                  </Box>
                ))}
              </Box>
            ) : addresses.length === 0 ? (
              <Typography sx={{ color: Colors.text.placeholder }}>
                You do not have any saved addresses yet.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {addresses.map((addr) => (
                  <Box
                    key={addr.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      border: `1px solid ${Colors.border.subtle}`,
                      borderRadius: 2,
                    }}
                  >
                    <Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography sx={{ fontWeight: 600 }}>
                          {addr.label}
                        </Typography>
                        {addr.isDefault && (
                          <CheckCircleIcon
                            sx={{
                              color: Colors.background.brand,
                              fontSize: "1.2rem",
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          color: Colors.text.placeholder,
                          fontSize: "0.85rem",
                        }}
                      >
                        {addr.line1}
                      </Typography>
                      <Typography
                        sx={{
                          color: Colors.text.placeholder,
                          fontSize: "0.85rem",
                        }}
                      >
                        {addr.city}, {addr.postcode}
                      </Typography>
                      {addr.instructions && (
                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: "0.8rem",
                            color: Colors.text.placeholder,
                            fontStyle: "italic",
                          }}
                        >
                          📍 {addr.instructions}
                        </Typography>
                      )}
                      {!addr.isDefault && (
                        <Typography
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          sx={{
                            mt: 1,
                            fontSize: "0.85rem",
                            color: Colors.background.brand,
                            fontWeight: 500,
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          Set as Default
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => {
                          setEditingAddress(addr);
                          setShowAddressModal(true);
                        }}
                        size="small"
                      >
                        <EditIcon sx={{ fontSize: "1.2rem" }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteAddress(addr.id)}
                        size="small"
                      >
                        <DeleteIcon sx={{ fontSize: "1.2rem" }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        );

      case "Payments":
        return (
          <Card
            sx={{
              p: 3,
              borderRadius: "12px",
              border: `1px solid ${Colors.border.subtle}`,
              boxShadow: "none",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Payment Methods
              </Typography>
              <Button
                variant="filled"
                sx={{ fontSize: "0.85rem", py: 0.5 }}
                onClick={() => setShowPaymentModal(true)}
              >
                <AddIcon sx={{ mr: 0.5 }} /> Add New
              </Button>
            </Box>
            {paymentsLoading ? (
              <Typography sx={{ color: Colors.text.placeholder }}>
                Loading payment methods...
              </Typography>
            ) : payments.length === 0 ? (
              <Box
                sx={{
                  p: 3,
                  border: `1px solid ${Colors.border.subtle}`,
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <CreditCardIcon
                  sx={{ color: Colors.text.placeholder, fontSize: 40, mb: 1 }}
                />
                <Typography sx={{ color: Colors.text.placeholder }}>
                  No saved payment methods
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {payments.map((pay) => (
                  <Box
                    key={pay.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      border: `1px solid ${Colors.border.subtle}`,
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <CreditCardIcon sx={{ color: Colors.text.placeholder }} />
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography sx={{ fontWeight: 600 }}>
                            {pay.brand.toUpperCase()} ****{pay.last4}
                          </Typography>
                          {pay.isDefault && (
                            <CheckCircleIcon
                              sx={{
                                color: Colors.background.brand,
                                fontSize: "1.2rem",
                              }}
                            />
                          )}
                        </Box>
                        <Typography
                          sx={{
                            color: Colors.text.placeholder,
                            fontSize: "0.85rem",
                          }}
                        >
                          Expires {String(pay.expMonth).padStart(2, "0")}/
                          {String(pay.expYear).slice(-2)}
                        </Typography>
                        {!pay.isDefault && (
                          <Typography
                            onClick={() =>
                              void handleSetDefaultPaymentMethod(pay.id)
                            }
                            sx={{
                              mt: 1,
                              fontSize: "0.85rem",
                              color: Colors.background.brand,
                              fontWeight: 500,
                              cursor: "pointer",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            Set as Default
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => setPaymentMethodToDelete(pay)}
                      aria-label={`Delete ${pay.brand} ending in ${pay.last4}`}
                    >
                      <DeleteIcon sx={{ fontSize: "1.2rem" }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        );

      case "Password": {
        const passwordsMatch =
          newPassword === confirmPassword && newPassword.length > 0;
        const canUpdate = currentPassword.length > 0 && passwordsMatch;

        return (
          <Card
            sx={{
              p: 3,
              borderRadius: "12px",
              border: `1px solid ${Colors.border.subtle}`,
              boxShadow: "none",
              overflow: "hidden",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
              Password
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <TextInput
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Typography
                    sx={{
                      color: Colors.background.brand,
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      width: "fit-content",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => navigate("/account/recovery")}
                  >
                    Forgot password?
                  </Typography>
                </Box>
              </Box>

              <TextInput
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextInput
                fullWidth
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={
                  confirmPassword.length > 0 && !passwordsMatch
                    ? "Passwords do not match"
                    : undefined
                }
              />
            </Box>
            <Button
              variant="filled"
              sx={{ mt: 3, width: "100%" }}
              disabled={!canUpdate}
              onClick={async () => {
                const success = await updatePassword({
                  currentPassword,
                  newPassword,
                });
                if (success) {
                  alert("Password updated successfully");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                } else {
                  setError("Failed to update password");
                }
              }}
            >
              Update Password
            </Button>
          </Card>
        );
      }

      case "Notifications":
        return (
          <Card
            sx={{
              p: 3,
              borderRadius: "12px",
              border: `1px solid ${Colors.border.subtle}`,
              boxShadow: "none",
              overflow: "hidden",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
              Notification Preferences
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  border: `1px solid ${Colors.border.subtle}`,
                  borderRadius: 2,
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    Order Updates
                  </Typography>
                  <Typography
                    sx={{ color: Colors.text.placeholder, fontSize: "0.85rem" }}
                  >
                    Get notified about your order status
                  </Typography>
                </Box>
                <ClickableSwitch
                  checked={notifications.orderUpdates}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      orderUpdates: e.target.checked,
                    })
                  }
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  border: `1px solid ${Colors.border.subtle}`,
                  borderRadius: 2,
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    Promotions & Offers
                  </Typography>
                  <Typography
                    sx={{ color: Colors.text.placeholder, fontSize: "0.85rem" }}
                  >
                    Receive promotional emails
                  </Typography>
                </Box>
                <ClickableSwitch
                  checked={notifications.promotions}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      promotions: e.target.checked,
                    })
                  }
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  border: `1px solid ${Colors.border.subtle}`,
                  borderRadius: 2,
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>Newsletter</Typography>
                  <Typography
                    sx={{ color: Colors.text.placeholder, fontSize: "0.85rem" }}
                  >
                    Latest news and updates
                  </Typography>
                </Box>
                <ClickableSwitch
                  checked={notifications.newsletter}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      newsletter: e.target.checked,
                    })
                  }
                />
              </Box>
            </Box>
          </Card>
        );

      case "Delete account":
        return (
          <Card
            sx={{
              p: 3,
              borderRadius: "12px",
              border: `1px solid ${Colors.border.subtle}`,
              boxShadow: "none",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: Colors.background.danger,
                }}
              >
                Delete Account
              </Typography>
              <Typography sx={{ color: Colors.text.placeholder, mb: 3 }}>
                Once you delete your account, there is no going back. Please be
                certain.
              </Typography>
              <Button
                variant="border"
                onClick={() => setShowDeleteAccountDialog(true)}
                sx={{
                  borderColor: Colors.background.danger,
                  color: Colors.background.danger,
                  width: "100%",
                  "&:hover": {
                    borderColor: Colors.background.dangerHover,
                    backgroundColor: Colors.error.lighter,
                  },
                }}
              >
                <DeleteIcon sx={{ mr: 1 }} />
                Delete Account
              </Button>
            </Box>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        mt: 7,
        minHeight: "calc(100vh - 130px)",
        backgroundColor: Colors.background.default,
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    backgroundColor: Colors.background.brand,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: Colors.text.inverse,
                      fontWeight: "bold",
                      fontSize: "1.8rem",
                    }}
                  >
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{ fontWeight: "bold", color: Colors.text.default }}
                  >
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography
                    sx={{ color: Colors.text.placeholder, fontSize: "0.85rem" }}
                  >
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <List
              disablePadding
              sx={{ borderTop: `1px solid ${Colors.border.subtle}` }}
            >
              {menuItems.map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    selected={selectedItem === item.label}
                    onClick={() => setSelectedItem(item.label)}
                    sx={{
                      py: 1.5,
                      borderBottom: `1px solid ${Colors.border.subtle}`,
                      transition: "background-color 0.2s ease",
                      "&.Mui-selected": {
                        backgroundColor: "transparent",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.03)",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  >
                    <item.icon
                      sx={{
                        mr: 2,
                        color: item.danger
                          ? Colors.background.danger
                          : selectedItem === item.label
                            ? Colors.background.brand
                            : Colors.text.default,
                        fontSize: "1.3rem",
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: item.danger
                          ? Colors.background.danger
                          : selectedItem === item.label
                            ? Colors.background.brand
                            : Colors.text.default,
                      }}
                    >
                      {item.label}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <List disablePadding>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout} sx={{ py: 1.5 }}>
                  <LogoutIcon
                    sx={{
                      mr: 2,
                      color: Colors.text.default,
                      fontSize: "1.3rem",
                    }}
                  />
                  <Typography
                    sx={{ fontWeight: 500, color: Colors.text.default }}
                  >
                    Log out
                  </Typography>
                </ListItemButton>
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={8}>
            {renderRightContent()}
          </Grid>
        </Grid>
      </Box>

      <OrderDetailsModal
        open={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />

      <AddressModal
        open={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        address={editingAddress}
        onSave={handleSaveAddress}
      />

      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSaved={loadPaymentMethods}
      />

      <PopUpDialog
        open={Boolean(paymentMethodToDelete)}
        onClose={() => {
          if (!isDeletingPaymentMethod) {
            setPaymentMethodToDelete(null);
          }
        }}
        onConfirm={() => void handleDeletePaymentMethod()}
        title="Delete payment method?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loadingLabel="Deleting..."
        danger
        loading={isDeletingPaymentMethod}
        disableClose={isDeletingPaymentMethod}
      >
        <Typography sx={{ color: Colors.text.default }}>
          Are you sure you want to remove{" "}
          {paymentMethodToDelete?.brand.toUpperCase()} ending in{" "}
          {paymentMethodToDelete?.last4}? You will need to enter the card again
          to use it later.
        </Typography>
      </PopUpDialog>

      <PopUpDialog
        open={showDeleteAccountDialog}
        onClose={() => setShowDeleteAccountDialog(false)}
        onConfirm={() => void handleDeleteAccount()}
        title="Delete account?"
        description="Are you sure you want to delete your account? This action cannot be undone."
        confirmLabel="Delete account"
        cancelLabel="Cancel"
        loadingLabel="Deleting..."
        danger
        loading={isDeletingAccount}
        disableClose={isDeletingAccount}
      />

      <Dialog
        open={showDeleteConfirmDialog}
        onClose={() => setShowDeleteConfirmDialog(false)}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Remove Address</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this address? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowDeleteConfirmDialog(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            sx={{ marginLeft: "none" }}
            onClick={confirmDeleteAddress}
            variant="filled"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
