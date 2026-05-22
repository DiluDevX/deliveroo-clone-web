import { describe, expect, it } from "vitest";
import cartReducer, {
  addItem,
  CartItem,
  CartState,
  fetchCart,
  removeItem,
  updateQuantity,
} from "../src/store/cartSlice";
import { CartItemData } from "../src/types/cart.types";

const baseDish = {
  _id: "dish-1",
  name: "Margherita Pizza",
  description: "Tomato and mozzarella",
  price: "12.50",
  image: "/pizza.jpg",
  categoryId: "pizza",
};

const initialState: CartState = {
  items: [],
  isLoading: false,
  isSyncing: false,
};

const cartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  ...baseDish,
  quantity: 1,
  cartItemId: "cart-item-1",
  ...overrides,
});

describe("cartSlice", () => {
  it("increments quantity instead of duplicating the same dish", () => {
    const withOneItem = cartReducer(initialState, addItem(baseDish));
    const withDuplicateDish = cartReducer(withOneItem, addItem(baseDish));

    expect(withDuplicateDish.items).toHaveLength(1);
    expect(withDuplicateDish.items[0]).toMatchObject({
      _id: "dish-1",
      quantity: 2,
    });
  });

  it("removes items by either cart item id or dish id", () => {
    const state: CartState = {
      ...initialState,
      items: [
        cartItem({ _id: "dish-1", cartItemId: "cart-item-1" }),
        cartItem({ _id: "dish-2", cartItemId: "cart-item-2" }),
      ],
    };

    const removedByCartItemId = cartReducer(state, removeItem("cart-item-1"));
    const removedByDishId = cartReducer(
      removedByCartItemId,
      removeItem("dish-2"),
    );

    expect(removedByCartItemId.items.map((item) => item._id)).toEqual([
      "dish-2",
    ]);
    expect(removedByDishId.items).toEqual([]);
  });

  it("removes an item when quantity is updated to zero", () => {
    const state: CartState = {
      ...initialState,
      items: [cartItem({ quantity: 2 })],
    };

    const result = cartReducer(
      state,
      updateQuantity({ cartItemId: "cart-item-1", quantity: 0 }),
    );

    expect(result.items).toEqual([]);
  });

  it("replaces local cart items with fetched server cart items", () => {
    const state: CartState = {
      ...initialState,
      isLoading: true,
      items: [cartItem({ quantity: 3 })],
    };

    const serverItems: CartItemData[] = [
      {
        id: "server-cart-1",
        dishId: "dish-1",
        dishName: "Updated Pizza",
        dishImageUrl: "/updated.jpg",
        unitPrice: 13.25,
        quantity: 1,
        modifiers: [],
        createdAt: "2026-05-20T00:00:00.000Z",
        updatedAt: "2026-05-20T00:00:00.000Z",
      },
      {
        id: "server-cart-2",
        dishId: "dish-2",
        dishName: "Garlic Bread",
        dishImageUrl: "/garlic.jpg",
        unitPrice: 4.5,
        quantity: 2,
        modifiers: [],
        createdAt: "2026-05-20T00:00:00.000Z",
        updatedAt: "2026-05-20T00:00:00.000Z",
      },
    ];

    const result = cartReducer(
      state,
      fetchCart.fulfilled(serverItems, "request-id"),
    );

    expect(result.isLoading).toBe(false);
    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toMatchObject({
      _id: "dish-1",
      name: "Updated Pizza",
      price: "13.25",
      quantity: 1,
      cartItemId: "server-cart-1",
    });
    expect(result.items[1]).toMatchObject({
      _id: "dish-2",
      quantity: 2,
    });
  });
});
