export interface Restaurant {
  id: string;
  name: string;
  image: string;
  description: string;
  tags: string[];
  openingAt: string;
  closingAt: string;
  minimumValue: string;
  deliveryCharge: string;
}

export interface GetASingleRestaurant {
  data: Restaurant;
}
