export type CheckGetAllRestaurantsResponse = {
  data: [string];
  message: string;
};

export type CheckFilteredRestaurantsResponse = {
  data: [string];
  message: string;
};

export type CheckRestaurantsResponse = {
  data: {
    id: string;
    name: string;
    image: string;
    description: string;
    tags: [string];
    openingAt: string;
    closingAt: string;
    minimumValue: string;
    deliveryCharge: string;
  };
  message: string;
};

export interface FilteredRestaurant {
  name: string;
  image: string;
  description: string;
  tags: string[];
  openingAt: string;
  closingAt: string;
  minimumValue: string;
  deliveryCharge: string;
}
