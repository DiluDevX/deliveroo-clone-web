import axios, { isAxiosError } from "axios";
import {
  PaymentIntentRequest,
  PaymentIntentResponse,
  PaymentResponse,
  OrderResponse,
} from "../types/payment.types";
import { getAuthHeader } from "./auth-headers";

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
