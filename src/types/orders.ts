export interface Order {
  id: string;
  restaurantId: string;
  userId: string;
  items: {
    dishId: string;
    quantity: number;
  }[];
  totalAmount: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllOrders {
  data: Order[];
}

export interface CreateOrderResponse {
  message: string;
  orderId: string;
}

export interface Orders {
  id: string;
  restaurantId: string;
  userId: string;
  items: Array<{
    dish: string;
    quantity: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface FetchedAllOrders {
  _id: string;
  id: string;
  restaurantId: {
    _id: string;
    name: string;
  };
  userId: string;
  items: Array<{
    _id: string;
    dish: string;
    quantity: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
