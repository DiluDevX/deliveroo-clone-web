import axios, { isAxiosError } from "axios";

interface PaymentIntentRequest {
  orderId: string;
  userId: string;
  restaurantId: string;
  amount: number;
  currency?: string;
  paymentMethod: "CASH_ON_DELIVERY" | "CARD";
  commissionPercentage: number;
}

interface PaymentIntentResponse {
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

interface PaymentResponse {
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

interface OrderResponse {
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

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "x-api-key": import.meta.env.VITE_BFF_API_KEY || "your-bff-api-key",
  };
};

export const createPaymentIntent = async (
  data: PaymentIntentRequest,
): Promise<PaymentIntentResponse | null> => {
  try {
    const response = await axios.post<PaymentIntentResponse>(
      "/api/payments/create-intent",
      data,
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error creating payment intent:", error.response?.data);
    }
    return null;
  }
};

export const getPayment = async (
  paymentId: string,
): Promise<PaymentResponse | null> => {
  try {
    const response = await axios.get<PaymentResponse>(
      `/api/payments/${paymentId}`,
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching payment:", error.response?.data);
    }
    return null;
  }
};

export const getPaymentByOrderId = async (
  orderId: string,
): Promise<OrderResponse | null> => {
  try {
    const response = await axios.get<OrderResponse>(
      `/api/payments/order/${orderId}`,
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching order:", error.response?.data);
    }
    return null;
  }
};

export const confirmPayment = async (
  paymentId: string,
): Promise<PaymentResponse | null> => {
  try {
    const response = await axios.post<PaymentResponse>(
      `/api/payments/${paymentId}/confirm`,
      {},
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error confirming payment:", error.response?.data);
    }
    return null;
  }
};

export const cancelPayment = async (
  paymentId: string,
  refundReason?: string,
): Promise<PaymentResponse | null> => {
  try {
    const response = await axios.post<PaymentResponse>(
      `/api/payments/${paymentId}/cancel`,
      { refundReason },
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error canceling payment:", error.response?.data);
    }
    return null;
  }
};
