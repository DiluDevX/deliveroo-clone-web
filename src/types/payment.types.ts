export interface PaymentIntentRequest {
  orderId: string;
  expectedTotalAmount: number;
}

export interface PaymentIntentResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    status: string;
    clientSecret: string;
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
