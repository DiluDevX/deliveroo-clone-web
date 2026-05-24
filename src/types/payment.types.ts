export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCEEDED"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface PaymentIntentRequest {
  orderId: string;
  /** Amount in GBP decimal format, e.g. 15.99. */
  expectedTotalAmount: number;
}

export interface PaymentIntentResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    status: PaymentStatus;
    clientSecret?: string;
  };
}

export interface SetupIntentResponse {
  success: boolean;
  message: string;
  data: {
    setupIntentId: string;
    clientSecret: string;
  };
}

export interface UserPaymentMethod {
  id: string;
  providerPaymentMethodId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  funding: string | null;
  country: string | null;
  cardholderName: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPaymentMethodResponse {
  success: boolean;
  message: string;
  data: UserPaymentMethod;
}

export interface UserPaymentMethodsResponse {
  success: boolean;
  message: string;
  data: UserPaymentMethod[];
}

export interface PaymentResponse {
  success: boolean;
  data: {
    id: string;
    orderId: string;
    status: PaymentStatus;
    /** Amount in minor currency units from payment-service, e.g. pence for GBP. */
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
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentId: string | null;
    paymentMethod: string | null;
    paymentExpiresAt: string | null;
    /** Order total in GBP decimal format as returned by order-service. */
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
