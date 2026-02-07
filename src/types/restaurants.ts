export interface Restaurant {
  id: string;
  name: string;
  image: string;
  description: string;
  adminId: string;
  tags: string[];
  openingAt: string;
  closingAt: string;
  minimumValue: string;
  deliveryCharge: string;
  cuisine: string;
  rating: number;
  totalOrders: number;
  totalRevenue: number;
  status: "active" | "disabled";
}

export interface GetASingleRestaurant {
  data: Restaurant;
}
