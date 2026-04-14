import axios, { isAxiosError } from "axios";

interface DeliveryAddress {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
}

interface CheckoutRequest {
  deliveryAddress: DeliveryAddress;
  restaurantName: string;
  restaurantAddress: string;
  deliveryFee: number;
  serviceFee: number;
  discountAmount?: number;
  promoCode?: string;
  estimatedDeliveryAt?: string;
  paymentMethod?: string;
}

interface CheckoutResponse {
  orderId: string;
  status: string;
  estimatedDeliveryAt: string;
  total: number;
}

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "x-api-key": import.meta.env.VITE_BFF_API_KEY || "your-bff-api-key",
  };
};

export const checkoutCart = async (
  checkoutData: CheckoutRequest,
): Promise<CheckoutResponse | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await axios.post<CheckoutResponse>(
      "/api/cart/checkout",
      checkoutData,
      {
        headers: getAuthHeader(),
      },
    );

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error during checkout:", error.response?.data);
    }
    return null;
  }
};
