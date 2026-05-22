import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { IDish } from "../data/Sides";
import * as cartService from "../services/cart.service";
import { RootState } from "./store";
import { CartItemData } from "../types/cart.types";

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

const initialState: CartState = {
  items: [],
  isLoading: false,
  isSyncing: false,
  restaurantId: null,
  restaurantName: null,
};

type SetCartPayload =
  | CartItem[]
  | {
      items: CartItem[];
      restaurantId?: string | null;
      restaurantName?: string | null;
    };

const getSelectedRestaurant = () => ({
  restaurantId: localStorage.getItem("selected-restaurant-id"),
  restaurantName: localStorage.getItem("selected-restaurant-name"),
});

const mapServerCartItem = (item: CartItemData): CartItem => ({
  _id: item.dishId,
  name: item.dishName,
  description: "",
  price: String(item.unitPrice),
  image: item.dishImageUrl,
  categoryId: "",
  quantity: item.quantity,
  cartItemId: item.id,
  modifiers: item.modifiers,
});

const matchesCartItem = (item: CartItem, id: string) =>
  item.cartItemId === id || item._id === id;

const isDummyCartItem = (item: CartItem) =>
  ["cart1", "cart2", "cart3"].includes(item.cartItemId ?? "") &&
  ["1", "2", "3"].includes(item._id);

// Async thunk to fetch cart from server
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState }) => {
    const state = getState() as RootState;
    if (!state.auth.isAuthenticated) {
      return {
        restaurantId: null,
        items: [],
      };
    }

    const cart = await cartService.getCart();
    return cart;
  },
);

// Async thunk to sync cart to server
export const syncCartToServer = createAsyncThunk(
  "cart/syncCartToServer",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    if (!state.auth.isAuthenticated) return false;

    const { restaurantId, restaurantName } = getSelectedRestaurant();
    if (!restaurantId) return false;

    const syncedItems = await cartService.syncCart(
      state.cart.items,
      restaurantId,
    );
    if (!syncedItems) return false;

    dispatch(
      setCart({
        items: syncedItems.map(mapServerCartItem),
        restaurantId,
        restaurantName,
      }),
    );

    return true;
  },
);

// Async thunk to add item and sync
export const addItemAndSync = createAsyncThunk(
  "cart/addItemAndSync",
  async (dish: IDish, { getState, dispatch }) => {
    const { restaurantId, restaurantName } = getSelectedRestaurant();

    if (restaurantId) {
      dispatch(setCartRestaurant({ restaurantId, restaurantName }));
    }
    dispatch(addItem(dish));

    const state = getState() as RootState;
    if (state.auth.isAuthenticated) {
      if (restaurantId) {
        const cartItem =
          state.cart.items.find((item) => item._id === dish._id) ??
          ({ ...dish, quantity: 1 } satisfies CartItem);
        const didSync = await cartService.addItemToCart(cartItem, restaurantId);
        if (didSync) {
          dispatch(fetchCart());
        }
      }
    }
  },
);

// Async thunk to remove item and sync
export const removeItemAndSync = createAsyncThunk(
  "cart/removeItemAndSync",
  async (cartItemId: string, { getState, dispatch }) => {
    dispatch(removeItem(cartItemId));

    const state = getState() as RootState;
    if (state.auth.isAuthenticated) {
      await cartService.removeItemFromCart(cartItemId);
    }
  },
);

// Async thunk to update quantity and sync
export const updateQuantityAndSync = createAsyncThunk(
  "cart/updateQuantityAndSync",
  async (
    payload: { cartItemId: string; quantity: number },
    { getState, dispatch },
  ) => {
    dispatch(updateQuantity(payload));

    const state = getState() as RootState;
    if (state.auth.isAuthenticated) {
      await cartService.updateCartItemQuantity(
        payload.cartItemId,
        payload.quantity,
      );
    }
  },
);

// Async thunk to clear cart and sync
export const clearCartAndSync = createAsyncThunk(
  "cart/clearCartAndSync",
  async (_, { getState, dispatch }) => {
    dispatch(clearCart());

    const state = getState() as RootState;
    if (state.auth.isAuthenticated) {
      await cartService.clearCartInDb();
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<IDish>) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id,
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => !matchesCartItem(item, action.payload),
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ cartItemId: string; quantity: number }>,
    ) => {
      const itemIndex = state.items.findIndex((item) =>
        matchesCartItem(item, action.payload.cartItemId),
      );
      if (itemIndex === -1) {
        return;
      }

      if (action.payload.quantity === 0) {
        state.items.splice(itemIndex, 1);
      } else {
        state.items[itemIndex].quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = null;
    },
    setCart: (state, action: PayloadAction<SetCartPayload>) => {
      if (Array.isArray(action.payload)) {
        state.items = action.payload;
        return;
      }

      state.items = action.payload.items;
      state.restaurantId = action.payload.restaurantId ?? null;
      state.restaurantName = action.payload.restaurantName ?? null;
    },
    setCartRestaurant: (
      state,
      action: PayloadAction<{
        restaurantId: string;
        restaurantName?: string | null;
      }>,
    ) => {
      state.restaurantId = action.payload.restaurantId;
      state.restaurantName = action.payload.restaurantName ?? null;
    },
    removeDummyCartItems: (state) => {
      state.items = state.items.filter((item) => !isDummyCartItem(item));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("auth/logOut", (state) => {
        state.items = [];
        state.isLoading = false;
        state.isSyncing = false;
        state.restaurantId = null;
        state.restaurantName = null;
      })
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.items.length === 0) {
          state.restaurantId =
            action.payload.restaurantId ?? state.restaurantId;
          return;
        }

        state.items = action.payload.items.map(mapServerCartItem);
        state.restaurantId = action.payload.restaurantId;
        state.restaurantName = null;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.isLoading = false;
      })
      // Sync cart
      .addCase(syncCartToServer.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(syncCartToServer.fulfilled, (state) => {
        state.isSyncing = false;
      })
      .addCase(syncCartToServer.rejected, (state) => {
        state.isSyncing = false;
      });
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  setCart,
  setCartRestaurant,
  removeDummyCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
