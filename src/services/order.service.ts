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
  success: boolean;
  message: string;
  data: {
    id: string;
    orderNumber: string;
    userId: string;
    restaurantId: string;
    driverId: string | null;
    status: string;
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    discountAmount: number;
    totalAmount: number;
    deliveryAddress: {
      line1: string;
      line2?: string;
      city: string;
      postcode: string;
      country: string;
      latitude?: number;
      longitude?: number;
      instructions?: string;
      label?: string;
    };
    restaurantName: string;
    restaurantAddress: string;
    estimatedDeliveryAt: string | null;
    actualDeliveryAt: string | null;
    promoCode: string | null;
    cancelledAt: string | null;
    cancellationActor: string | null;
    cancellationReason: string | null;
    items: Array<{
      id: string;
      dishId: string;
      dishName: string;
      dishImageUrl: string;
      dishCategory: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
      modifiers: Array<{
        id: string;
        name: string;
        option: string;
        extraPrice: number;
      }>;
    }>;
    statusHistory: Array<{
      id: string;
      status: string;
      note: string | null;
      actorId: string | null;
      actorType: string | null;
      createdAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
  };
}

interface CheckoutResult {
  orderId: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  estimatedDeliveryAt: string | null;
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
): Promise<CheckoutResult | null> => {
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

    if (response.data.success && response.data.data) {
      return {
        orderId: response.data.data.id,
        orderNumber: response.data.data.orderNumber,
        status: response.data.data.status,
        totalAmount: response.data.data.totalAmount,
        estimatedDeliveryAt: response.data.data.estimatedDeliveryAt,
      };
    }
    return null;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error during checkout:", error.response?.data);
    }
    return null;
  }
};
