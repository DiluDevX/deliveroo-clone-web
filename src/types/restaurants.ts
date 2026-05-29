export interface Restaurant {
  id: string;
  orgId?: string;
  name: string;
  image: string;
  address?: string | null;
  description: string | null;
  tags: string[];
  openingAt: string;
  closingAt: string;
  minimumValue: number | string;
  deliveryCharge: number | string;
  commissionPercentage?: number;
  cuisine?: string | null;
  rating?: number;
  totalOrders?: number;
  totalRevenue?: number;
  adminId?: string;
  status?: "ACTIVE" | "DISABLED";
  createdAt?: string;
  updatedAt?: string;
}

export interface GetASingleRestaurant {
  data: Restaurant;
}
