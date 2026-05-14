export interface Restaurant {
  id: string;
  orgId?: string;
  name: string;
  image: string;
  description: string | null;
  tags: string[];
  openingAt: string;
  closingAt: string;
  minimumValue: number | string;
  deliveryCharge: number | string;
  commissionPercentage?: number;
  cuisine?: string | null;
  rating?: number;
  status?: "ACTIVE" | "DISABLED";
  createdAt?: string;
  updatedAt?: string;
}

export interface GetASingleRestaurant {
  data: Restaurant;
}
