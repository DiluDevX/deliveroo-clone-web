import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckoutPage from "../src/pages/CheckoutPage";
import { checkoutCart } from "../src/services/order.service";
import { getCart, syncCart } from "../src/services/cart.service";
import { renderWithProviders } from "./test-utils";
import { CartItem } from "../src/store/cartSlice";

vi.mock("../src/services/order.service", () => ({ checkoutCart: vi.fn() }));
vi.mock("../src/services/cart.service", () => ({
  getCart: vi.fn(),
  syncCart: vi.fn(),
  clearCartInDb: vi.fn(),
}));
vi.mock("../src/services/user.service", () => ({
  getUserAddresses: vi.fn().mockResolvedValue([]),
  createUserAddress: vi.fn(),
  updateUserProfile: vi.fn(),
}));

const Confirmation = () => {
  const location = useLocation();
  const state = location.state as {
    orderId?: string;
    orderDetails?: {
      subtotal: number;
      shippingFee: number;
      serviceFee: number;
      discount: number;
      total: number;
    };
  } | null;

  return (
    <div>
      <div>Confirmed order: {state?.orderId}</div>
      <div>Confirmed totals: {JSON.stringify(state?.orderDetails)}</div>
    </div>
  );
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

describe("CheckoutPage cash checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("selected-restaurant-id", "restaurant-1");
    localStorage.setItem("selected-restaurant-name", "Test Restaurant");
    localStorage.setItem("selected-restaurant-address", "1 Food Street");
    vi.mocked(getCart).mockResolvedValue({
      restaurantId: "restaurant-1",
      items: [],
    });
    vi.mocked(syncCart).mockResolvedValue([]);
  });

  it("submits only the cash checkout contract and confirms server returned totals", async () => {
    vi.mocked(checkoutCart).mockResolvedValue({
      orderId: "order-1",
      orderNumber: "ORD-1",
      status: "PENDING",
      paymentStatus: "PENDING",
      paymentId: null,
      paymentMethod: "cash",
      paymentExpiresAt: null,
      subtotal: 26.25,
      deliveryFee: 2.5,
      serviceFee: 1.25,
      discountAmount: 0.5,
      totalAmount: 29.5,
      estimatedDeliveryAt: null,
    });

    const user = userEvent.setup();
    renderWithProviders(
      <MemoryRouter initialEntries={["/checkout"]}>
        <Routes>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<Confirmation />} />
        </Routes>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            isAuthenticated: true,
            isAuthInitialized: true,
            user: {
              id: "user-1",
              firstName: "Test",
              lastName: "Customer",
              email: "test@example.com",
              phone: "1234567890",
            },
          },
          cart: { items: [cartItem] },
        },
      },
    );

    await screen.findByText("Delivery Address");
    await user.type(screen.getByLabelText("Address"), "10 Main Street");
    await user.type(screen.getByLabelText("City"), "London");
    await user.type(screen.getByLabelText("ZIP Code"), "SW1A 1AA");
    await user.click(screen.getByLabelText("Cash on Delivery"));
    await user.click(screen.getByRole("button", { name: "Place Order" }));

    await waitFor(() => expect(checkoutCart).toHaveBeenCalledTimes(1));
    expect(checkoutCart).toHaveBeenCalledWith({
      deliveryAddress: {
        line1: "10 Main Street",
        city: "London",
        postcode: "SW1A 1AA",
        country: "UK",
      },
      paymentMethod: "cash",
    });
    expect(
      await screen.findByText("Confirmed order: ORD-1"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Confirmed totals: {"subtotal":26.25,"shippingFee":2.5,"serviceFee":1.25,"discount":0.5,"total":29.5}',
      ),
    ).toBeInTheDocument();
  });
});
