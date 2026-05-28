import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cart from "../src/features/menu/components/Cart";
import { CartItem } from "../src/store/cartSlice";
import { renderWithProviders } from "./test-utils";

const LocationDisplay = () => {
  const location = useLocation();
  return <div>Current route: {location.pathname}</div>;
};

const cartItem: CartItem = {
  _id: "dish-1",
  name: "Margherita Pizza",
  description: "Tomato and mozzarella",
  price: "12.50",
  image: "/pizza.jpg",
  categoryId: "pizza",
  quantity: 2,
  cartItemId: "cart-item-1",
};

const renderCart = (
  isAuthenticated: boolean,
  cartItems: CartItem[] = [cartItem],
) => {
  return renderWithProviders(
    <MemoryRouter initialEntries={["/menu"]}>
      <Routes>
        <Route
          path="/menu"
          element={
            <>
              <Cart />
              <LocationDisplay />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <>
              <div>Checkout page</div>
              <LocationDisplay />
            </>
          }
        />
        <Route
          path="/account/login"
          element={
            <>
              <div>Login page</div>
              <LocationDisplay />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        auth: {
          isAuthenticated,
          isAuthInitialized: true,
        },
        cart: {
          items: cartItems,
        },
      },
    },
  );
};

describe("Cart", () => {
  it("shows the login dialog instead of navigating when checkout requires auth", async () => {
    const user = userEvent.setup();
    renderCart(false);

    await user.click(screen.getByRole("button", { name: "Go to Checkout" }));

    expect(screen.getByText("Login Required")).toBeInTheDocument();
    expect(screen.getByText("Current route: /menu")).toBeInTheDocument();
  });

  it("stores the checkout redirect and sends unauthenticated users to login", async () => {
    const user = userEvent.setup();
    renderCart(false);

    await user.click(screen.getByRole("button", { name: "Go to Checkout" }));
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(sessionStorage.getItem("redirectAfterLogin")).toBe("/checkout");
    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(
      screen.getByText("Current route: /account/login"),
    ).toBeInTheDocument();
  });

  it("allows authenticated users to continue to checkout", async () => {
    const user = userEvent.setup();
    renderCart(true);

    await user.click(screen.getByRole("button", { name: "Go to Checkout" }));

    expect(screen.getByText("Checkout page")).toBeInTheDocument();
    expect(screen.getByText("Current route: /checkout")).toBeInTheDocument();
  });
});
