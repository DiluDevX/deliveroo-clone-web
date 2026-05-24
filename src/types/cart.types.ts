import type { IDish } from "../data/Sides";

export interface CartItem extends IDish {
  quantity: number;
  cartItemId?: string;
  modifiers?: Array<{
    id: string;
    name: string;
    option: string;
    extraPrice: number;
  }>;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isSyncing: boolean;
  restaurantId: string | null;
  restaurantName: string | null;
}

export interface CartItemData {
  id: string;
  dishId: string;
  dishName: string;
  dishImageUrl: string;
  unitPrice: number;
  quantity: number;
  modifiers: Array<{
    id: string;
    name: string;
    option: string;
    extraPrice: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data: {
    id: string;
    userId: string;
    restaurantId: string;
    items: CartItemData[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface CartSnapshot {
  restaurantId: string | null;
  items: CartItemData[];
}
