export interface OrderItem {
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
}

export interface OrderStatus {
  id: string;
  status: string;
  note: string | null;
  actorId: string | null;
  actorType: string | null;
  createdAt: string;
}

export interface DeliveryAddress {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
  label?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  restaurantId: string;
  driverId: string | null;
  status: string;
  paymentStatus: string;
  paymentId: string | null;
  paymentMethod: string | null;
  paymentExpiresAt: string | null;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  deliveryAddress: DeliveryAddress;
  restaurantName: string;
  restaurantAddress: string;
  estimatedDeliveryAt: string | null;
  actualDeliveryAt: string | null;
  promoCode: string | null;
  cancelledAt: string | null;
  cancellationActor: string | null;
  cancellationReason: string | null;
  items: OrderItem[];
  statusHistory: OrderStatus[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutRequest {
  userId?: string;
  restaurantId?: string;
  items?: Array<{
    menuItemId: string;
    quantity: number;
    price: number;
  }>;
  deliveryAddress: DeliveryAddress;
  restaurantName?: string;
  restaurantAddress?: string;
  deliveryFee: number;
  serviceFee: number;
  discountAmount?: number;
  promoCode?: string;
  estimatedDeliveryAt?: string;
  paymentMethod?: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    orderNumber: string;
    userId: string;
    restaurantId: string;
    driverId: string | null;
    status: string;
    paymentStatus: string;
    paymentId: string | null;
    paymentMethod: string | null;
    paymentExpiresAt: string | null;
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

export interface CheckoutResult {
  orderId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentId: string | null;
  paymentMethod: string | null;
  paymentExpiresAt: string | null;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  estimatedDeliveryAt: string | null;
}
