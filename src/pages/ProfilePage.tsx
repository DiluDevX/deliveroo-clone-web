import {
  Box,
  Typography,
  Card,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Colors } from "../theme/colors";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "../features/menu/components/Button";
import TextInput from "../features/menu/components/TextInput";
import { useAppSelector, useAppDispatch } from "../store/hooks/cartHooks";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  updatePassword,
  getUserAddresses,
} from "../services/user.service";
import { getOrderHistory } from "../services/order.service";
import { Order } from "../types/order.types";
import { Address } from "../types/user.types";
import { logOut, setCredentials } from "../store/authSlice";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockIcon from "@mui/icons-material/Lock";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
  BikeScooter,
  CancelRounded,
  CheckCircle,
  LockClock,
  RestaurantMenu,
  ShoppingBag,
} from "@mui/icons-material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

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
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string>("Personal details");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

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

  const loadProfile = async () => {
    setIsLoading(true);
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
    const addressList = await getUserAddresses();
    setAddresses(addressList);
    setIsLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      const success = await deleteUserAccount();
      if (success) {
        dispatch(logOut());
        navigate("/");
      } else {
        setError("Failed to delete account");
      }
    }
  };

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  const menuItems = [
    {
      icon: PersonIcon,
      label: "Personal details",
      description: "Name, email and phone",
    },
    {
      icon: ShoppingBag,
      label: "Order history",
      description: "View your past orders",
    },
    {
      icon: LocationOnIcon,
      label: "Saved addresses",
      description: "Manage delivery addresses",
    },
    {
      icon: CreditCardIcon,
      label: "Payments",
      description: "Manage payment methods",
    },
    { icon: LockIcon, label: "Password", description: "Change your password" },
    {
      icon: NotificationsIcon,
      label: "Notifications",
      description: "Email and SMS preferences",
    },
    {
      icon: DeleteIcon,
      label: "Delete account",
      description: "Permanently delete your account",
      danger: true,
    },
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
                      backgroundColor: "rgba(229, 57, 53, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography sx={{ color: "#e53935" }}>{error}</Typography>
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
              return { bg: "#e8f5e9", color: "#2e7d32" };
            case "CANCELLED":
            case "REFUNDED":
              return { bg: "#ffebee", color: "#c62828" };
            case "ON_THE_WAY":
              return { bg: "#f3e5f5", color: "#7b1fa2" };
            case "PREPARING":
            case "CONFIRMED":
            case "PENDING":
              return { bg: "#e3f2fd", color: "#1565c0" };
            default:
              return { bg: "#fff3e0", color: "#e65100" };
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
            case "PREPARING":
            case "CONFIRMED":
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
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography>Loading orders...</Typography>
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                            onClick={() =>
                              navigate(`/order/${order.id}`, {
                                state: { order },
                              })
                            }
                            sx={{ flex: 1, fontSize: "0.85rem" }}
                          >
                            View Details
                          </Button>
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
              <Button variant="filled" sx={{ fontSize: "0.85rem", py: 0.5 }}>
                <AddIcon sx={{ mr: 0.5 }} /> Add New
              </Button>
            </Box>
            {addresses.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <LocationOnIcon
                  sx={{ fontSize: 48, color: Colors.text.placeholder, mb: 2 }}
                />
                <Typography sx={{ color: Colors.text.placeholder }}>
                  No saved addresses
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {addresses.map((addr) => (
                  <Box
                    key={addr.id}
                    sx={{
                      p: 2,
                      border: `1px solid ${Colors.border.subtle}`,
                      borderRadius: 2,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      {addr.label}
                    </Typography>
                    <Typography
                      sx={{
                        color: Colors.text.placeholder,
                        fontSize: "0.9rem",
                      }}
                    >
                      {addr.line1}
                    </Typography>
                    <Typography
                      sx={{
                        color: Colors.text.placeholder,
                        fontSize: "0.9rem",
                      }}
                    >
                      {addr.city}, {addr.postcode}
                    </Typography>
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
              <Button variant="filled" sx={{ fontSize: "0.85rem", py: 0.5 }}>
                <AddIcon sx={{ mr: 0.5 }} /> Add New
              </Button>
            </Box>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CreditCardIcon
                sx={{ fontSize: 48, color: Colors.text.placeholder, mb: 2 }}
              />
              <Typography sx={{ color: Colors.text.placeholder }}>
                No saved payment methods
              </Typography>
            </Box>
          </Card>
        );

      case "Password": {
        const passwordsMatch =
          newPassword === confirmPassword && newPassword.length > 0;
        const canUpdate = passwordsMatch;

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
              Change Password
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                  newPassword,
                });
                if (success) {
                  alert("Password updated successfully");
                  setNewPassword("");
                  setConfirmPassword("");
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
                sx={{ fontWeight: "bold", mb: 2, color: "#e53935" }}
              >
                Delete Account
              </Typography>
              <Typography sx={{ color: Colors.text.placeholder, mb: 3 }}>
                Once you delete your account, there is no going back. Please be
                certain.
              </Typography>
              <Button
                variant="border"
                onClick={handleDeleteAccount}
                sx={{
                  borderColor: "#e53935",
                  color: "#e53935",
                  width: "100%",
                  "&:hover": {
                    borderColor: "#c62828",
                    backgroundColor: "rgba(229, 57, 53, 0.05)",
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
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 1, color: Colors.text.default }}
        >
          My account
        </Typography>
        <Typography sx={{ color: Colors.text.placeholder, mb: 4 }}>
          Manage your account settings
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "12px",
                border: `1px solid ${Colors.border.subtle}`,
                boxShadow: "none",
                overflow: "hidden",
              }}
            >
              <Box sx={{ p: 1 }}>
                <List disablePadding>
                  {menuItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                      <ListItemButton
                        selected={selectedItem === item.label}
                        onClick={() => setSelectedItem(item.label)}
                        sx={{
                          py: 2,
                          borderRadius: 1,
                          "&.Mui-selected": {
                            backgroundColor: "transparent",
                            color: Colors.text.inverse,
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <item.icon
                            sx={{
                              color:
                                selectedItem === item.label
                                  ? Colors.background.brand
                                  : Colors.text.placeholder,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          secondary={item.description}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color:
                              selectedItem === item.label
                                ? Colors.background.brand
                                : Colors.text.default,
                          }}
                          secondaryTypographyProps={{
                            color:
                              selectedItem === item.label
                                ? Colors.background.brand
                                : Colors.text.placeholder,
                            fontSize: "0.85rem",
                          }}
                        />
                        <ArrowForwardIcon
                          sx={{
                            color:
                              selectedItem === item.label
                                ? Colors.background.brand
                                : Colors.text.placeholder,
                            fontSize: "1.2rem",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Card>

            <Card
              sx={{
                mt: 2,
                borderRadius: "12px",
                border: `1px solid ${Colors.border.subtle}`,
                boxShadow: "none",
                overflow: "hidden",
              }}
            >
              <List disablePadding>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout} sx={{ py: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <LogoutIcon sx={{ color: Colors.text.placeholder }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Log out"
                      primaryTypographyProps={{
                        fontWeight: 600,
                        color: Colors.text.default,
                      }}
                    />
                    <ArrowForwardIcon
                      sx={{
                        color: Colors.text.placeholder,
                        fontSize: "1.2rem",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            {renderRightContent()}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProfilePage;
