export type IUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "user" | "platform_admin" | "restaurant_admin";
  status: "Active" | "Suspended";
  orderCount: number;
  createdAt: string;
  updatedAt: string;
  restaurantId?: string;
};
