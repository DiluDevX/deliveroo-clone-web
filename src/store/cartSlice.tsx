import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { IDish } from "../data/Sides";
import * as cartService from "../services/cart.service";
import { RootState } from "./store";

export interface CartItem extends IDish {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isSyncing: boolean;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  isSyncing: false,
};

// Async thunk to fetch cart from server
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState }) => {
    const state = getState() as RootState;
    if (!state.auth.isAuthenticated) return [];

    const items = await cartService.getCart();
    return items;
  },
);

// Async thunk to sync cart to server
export const syncCartToServer = createAsyncThunk(
  "cart/syncCartToServer",
  async (_, { getState }) => {
    const state = getState() as RootState;
    if (!state.auth.isAuthenticated) return false;

    return await cartService.syncCart(state.cart.items);
  },
);

// Async thunk to add item and sync
export const addItemAndSync = createAsyncThunk(
  "cart/addItemAndSync",
  async (dish: IDish, { getState, dispatch }) => {
    dispatch(addItem(dish));

    const state = getState() as RootState;
    if (state.auth.isAuthenticated) {
      const cartItem: CartItem = { ...dish, quantity: 1 };
      await cartService.addItemToCart(cartItem);
    }
  },
);

// Async thunk to remove item and sync
export const removeItemAndSync = createAsyncThunk(
  "cart/removeItemAndSync",
  async (dishId: string, { getState, dispatch }) => {
    dispatch(removeItem(dishId));

    const state = getState() as RootState;
    if (state.auth.isAuthenticated) {
      await cartService.removeItemFromCart(dishId);
    }
  },
);

// Async thunk to update quantity and sync
export const updateQuantityAndSync = createAsyncThunk(
  "cart/updateQuantityAndSync",
  async (
    payload: { _id: string; quantity: number },
    { getState, dispatch },
  ) => {
    dispatch(updateQuantity(payload));

    const state = getState() as RootState;
    if (state.auth.isAuthenticated) {
      await cartService.updateCartItemQuantity(payload._id, payload.quantity);
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
        (item) => item._id !== action.payload.toString(),
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ _id: string; quantity: number }>,
    ) => {
      const item = state.items.find((item) => item._id === action.payload._id);
      if (item) {
        if (action.payload.quantity === 0) {
          item.quantity = 0;
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.length > 0) {
          // Merge server cart with local cart
          action.payload.forEach((serverItem) => {
            const existingItem = state.items.find(
              (item) => String(item._id) === String(serverItem._id),
            );
            if (existingItem) {
              // Keep the higher quantity
              existingItem.quantity = Math.max(
                existingItem.quantity,
                serverItem.quantity,
              );
            } else {
              state.items.push(serverItem);
            }
          });
        }
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

export const { addItem, removeItem, updateQuantity, clearCart, setCart } =
  cartSlice.actions;
export default cartSlice.reducer;
