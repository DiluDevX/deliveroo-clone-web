import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Dish from "../src/features/menu/components/Dish";
import { CartItem } from "../src/store/cartSlice";
import { renderWithProviders } from "./test-utils";

const dish = {
  _id: "dish-2",
  name: "Chicken Katsu",
  description: "Crispy chicken with curry sauce",
  price: "14.50",
  image: "/katsu.jpg",
  categoryId: "mains",
};

const existingCartItem: CartItem = {
  _id: "dish-1",
  name: "Margherita Pizza",
  description: "Tomato and mozzarella",
  price: "12.50",
  image: "/pizza.jpg",
  categoryId: "pizza",
  quantity: 1,
  cartItemId: "cart-item-1",
};

describe("Dish", () => {
  it("asks before replacing a cart from another restaurant", async () => {
    const user = userEvent.setup();
    localStorage.setItem("selected-restaurant-id", "restaurant-2");
    localStorage.setItem("selected-restaurant-name", "Katsu House");

    const { store } = renderWithProviders(
      <MemoryRouter>
        <Dish data={dish} />
      </MemoryRouter>,
      {
        preloadedState: {
          cart: {
            items: [existingCartItem],
            restaurantId: "restaurant-1",
            restaurantName: "Pizza Place",
          },
        },
      },
    );

    await user.click(
      screen.getByRole("button", { name: "Add Chicken Katsu to cart" }),
    );

    expect(screen.getByText("Start a new order?")).toBeInTheDocument();
    expect(screen.getByText(/Pizza Place/)).toBeInTheDocument();
    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0]._id).toBe("dish-1");
  });

  it("clears the old restaurant cart when the user starts a new order", async () => {
    const user = userEvent.setup();
    localStorage.setItem("selected-restaurant-id", "restaurant-2");
    localStorage.setItem("selected-restaurant-name", "Katsu House");

    const { store } = renderWithProviders(
      <MemoryRouter>
        <Dish data={dish} />
      </MemoryRouter>,
      {
        preloadedState: {
          cart: {
            items: [existingCartItem],
            restaurantId: "restaurant-1",
            restaurantName: "Pizza Place",
          },
        },
      },
    );

    await user.click(
      screen.getByRole("button", { name: "Add Chicken Katsu to cart" }),
    );
    await user.click(screen.getByRole("button", { name: "Start new order" }));

    await waitFor(() => {
      expect(store.getState().cart.items).toHaveLength(1);
      expect(store.getState().cart.items[0]._id).toBe("dish-2");
      expect(store.getState().cart.restaurantId).toBe("restaurant-2");
      expect(store.getState().cart.restaurantName).toBe("Katsu House");
    });
  });
});
