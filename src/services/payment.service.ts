import { isAxiosError } from "axios";
import {
  PaymentIntentRequest,
  PaymentIntentResponse,
  PaymentResponse,
  OrderResponse,
  SetupIntentResponse,
  UserPaymentMethod,
  UserPaymentMethodResponse,
  UserPaymentMethodsResponse,
} from "../types/payment.types";
import { getAuthHeader } from "./auth-headers";
import { apiClient } from "./api.client";

export const createPaymentIntent = async (
  data: PaymentIntentRequest,
): Promise<PaymentIntentResponse | null> => {
  try {
    const response = await apiClient.post<PaymentIntentResponse>(
      "/payments/create-intent",
      data,
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error creating payment intent:", error.response?.data);
      console.error("Error status:", error.response?.status);
    } else {
      console.error("Non-axios error creating payment intent:", error);
    }
    return null;
  }
};

export const getPayment = async (
  paymentId: string,
): Promise<PaymentResponse | null> => {
  try {
    const response = await apiClient.get<PaymentResponse>(
      `/payments/${paymentId}`,
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
    const response = await apiClient.get<OrderResponse>(
      `/payments/order/${orderId}`,
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
    const response = await apiClient.post<PaymentResponse>(
      `/payments/${paymentId}/confirm`,
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
    const response = await apiClient.post<PaymentResponse>(
      `/payments/${paymentId}/cancel`,
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

export const getUserPaymentMethods = async (): Promise<UserPaymentMethod[]> => {
  try {
    const response = await apiClient.get<UserPaymentMethodsResponse>(
      "/payments/payment-methods",
      { headers: getAuthHeader() },
    );
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching payment methods:", error.response?.data);
    }
    return [];
  }
};

export const createSetupIntent =
  async (): Promise<SetupIntentResponse | null> => {
    try {
      const response = await apiClient.post<SetupIntentResponse>(
        "/payments/payment-methods/setup-intent",
        {},
        { headers: getAuthHeader() },
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Error creating setup intent:", error.response?.data);
      }
      return null;
    }
  };

export const finalizeSetupIntent = async (
  setupIntentId: string,
  setAsDefault: boolean,
): Promise<UserPaymentMethod | null> => {
  try {
    const response = await apiClient.post<UserPaymentMethodResponse>(
      "/payments/payment-methods/finalize",
      { setupIntentId, setAsDefault },
      { headers: getAuthHeader() },
    );
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error saving payment method:", error.response?.data);
    }
    return null;
  }
};

export const setDefaultPaymentMethod = async (
  paymentMethodId: string,
): Promise<UserPaymentMethod | null> => {
  try {
    const response = await apiClient.patch<UserPaymentMethodResponse>(
      `/payments/payment-methods/${paymentMethodId}/default`,
      {},
      { headers: getAuthHeader() },
    );
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Error setting default payment method:",
        error.response?.data,
      );
    }
    return null;
  }
};

export const deletePaymentMethod = async (
  paymentMethodId: string,
): Promise<boolean> => {
  try {
    await apiClient.delete<UserPaymentMethodResponse>(
      `/payments/payment-methods/${paymentMethodId}`,
      { headers: getAuthHeader() },
    );
    return true;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error deleting payment method:", error.response?.data);
    }
    return false;
  }
};
