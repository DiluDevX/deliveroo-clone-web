export interface PaymentIntentRequest {
  orderId: string;
  userId: string;
  restaurantId: string;
  amount: number;
  currency?: string;
  paymentMethod: "CASH_ON_DELIVERY" | "CARD";
  commissionPercentage: number;
}

export interface PaymentIntentResponse {
  success: boolean;
  data: {
    id: string;
    orderId: string;
    userId: string;
    restaurantId: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    commissionPercentage: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  data: {
    id: string;
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface OrderResponse {
  success: boolean;
  data: {
    id: string;
    userId: string;
    restaurantId: string;
    status: string;
    totalAmount: number;
    deliveryAddress: {
      line1: string;
      city: string;
      postcode: string;
      country: string;
    };
    estimatedDeliveryAt: string;
    createdAt: string;
    updatedAt: string;
  };
}
