import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  role: z.enum(["user", "platform_admin", "restaurant_admin"]),
  status: z.enum(["Active", "Suspended"]),
  orderCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  restaurantId: z.string().optional(),
});

export const RestaurantSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  description: z.string(),
  adminId: z.string(),
  tags: z.array(z.string()),
  openingAt: z.string(),
  closingAt: z.string(),
  minimumValue: z.string(),
  deliveryCharge: z.string(),
  cuisine: z.string(),
  rating: z.number(),
  totalOrders: z.number(),
  totalRevenue: z.number(),
  status: z.enum(["active", "disabled"]),
});

export const DishSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  image: z.string(),
  categoryId: z.number(),
});

export const CategorySchema = z.object({
  data: z.array(z.string()).optional(),
  id: z.number(),
  name: z.string(),
});

export const CartItemSchema = DishSchema.extend({
  quantity: z.number(),
});

export const FinancePayoutHistorySchema = z.object({
  amount: z.number(),
  date: z.string(),
  status: z.enum(["pending", "paid", "failed"]),
});

export const FinanceRecordSchema = z.object({
  id: z.string(),
  period: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  restaurantId: z.string(),
  totalRevenue: z.number(),
  platformCommission: z.number(),
  commissionPercentage: z.number(),
  amountDue: z.number(),
  amountPaid: z.number(),
  pendingAmount: z.number(),
  payoutHistory: z.array(FinancePayoutHistorySchema),
  lastPayoutDate: z.string(),
  nextPayoutDate: z.string(),
  status: z.enum(["pending", "paid"]),
});

export const FetchedOrderItemSchema = z.object({
  _id: z.string(),
  dish: z.string(),
  quantity: z.number(),
});

export const FetchedOrderRestaurantSchema = z.object({
  _id: z.string(),
  name: z.string(),
});

export const FetchedAllOrdersSchema = z.object({
  _id: z.string(),
  id: z.string(),
  restaurantId: FetchedOrderRestaurantSchema,
  userId: z.string(),
  items: z.array(FetchedOrderItemSchema),
  totalAmount: z.number(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
