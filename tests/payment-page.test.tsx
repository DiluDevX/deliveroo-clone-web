import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaymentPage from "../src/pages/PaymentPage";
import { CartItem } from "../src/store/cartSlice";
import { checkoutCart } from "../src/services/order.service";
import {
  confirmPayment,
  createPaymentIntent,
} from "../src/services/payment.service";
import { renderWithProviders } from "./test-utils";

vi.mock("../src/config/stripe", () => ({
  stripePromise: Promise.resolve(null),
}));

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("../src/features/menu/components/StripeCardForm", () => ({
  StripeCardForm: ({
    onPaymentSuccess,
  }: {
    onPaymentSuccess: () => Promise<void>;
  }) => (
    <button type="button" onClick={() => void onPaymentSuccess()}>
      Complete card payment
    </button>
  ),
}));

vi.mock("../src/services/order.service", () => ({
  checkoutCart: vi.fn(),
}));

vi.mock("../src/services/payment.service", () => ({
  createPaymentIntent: vi.fn(),
  confirmPayment: vi.fn(),
}));

const OrderConfirmation = () => {
  const location = useLocation();
  const state = location.state as { orderId?: string } | null;

  return <div>Confirmed order: {state?.orderId}</div>;
};

const cartItem: CartItem = {
  _id: "dish-1",
  name: "Margherita Pizza",
  description: "Tomato and mozzarella",
  price: "12.50",
  image: "/pizza.jpg",
  categoryId: 1,
  quantity: 2,
  cartItemId: "cart-item-1",
};

type TestCheckoutData = {
  address?: string;
  city?: string;
  zipCode?: string;
};

const defaultCheckoutData: TestCheckoutData = {
  address: "10 Main Street",
  city: "London",
  zipCode: "SW1A 1AA",
};

const renderPaymentPage = (
  checkoutData: TestCheckoutData = defaultCheckoutData,
) => {
  localStorage.setItem("selected-restaurant-name", "Test Restaurant");
  localStorage.setItem("selected-restaurant-address", "1 Food Street");

  return renderWithProviders(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/payment",
          state: {
            checkoutData,
            deliveryMethod: "delivery",
            paymentMethod: "CARD",
          },
        },
      ]}
    >
      <Routes>
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          isAuthInitialized: true,
        },
        cart: {
          items: [cartItem],
        },
      },
    },
  );
};

describe("PaymentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("automatically creates one checkout order before requesting a card payment intent", async () => {
    vi.mocked(checkoutCart).mockResolvedValue({
      orderId: "order-1",
      orderNumber: "ORD-1",
      status: "PENDING",
      totalAmount: 30.99,
      estimatedDeliveryAt: null,
    });
    vi.mocked(createPaymentIntent).mockResolvedValue({
      success: true,
      message: "Payment intent created",
      data: {
        paymentId: "payment-1",
        status: "PROCESSING",
        clientSecret: "client-secret",
      },
    });

    renderPaymentPage();

    await waitFor(() => {
      expect(checkoutCart).toHaveBeenCalledTimes(1);
      expect(createPaymentIntent).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.queryByRole("button", { name: "Prepare Payment" }),
    ).not.toBeInTheDocument();
    expect(checkoutCart).toHaveBeenCalledWith({
      deliveryAddress: {
        line1: "10 Main Street",
        city: "London",
        postcode: "SW1A 1AA",
        country: "UK",
      },
      restaurantName: "Test Restaurant",
      restaurantAddress: "1 Food Street",
      deliveryFee: 5,
      serviceFee: 0.99,
      discountAmount: 0,
      paymentMethod: "card",
    });
    expect(createPaymentIntent).toHaveBeenCalledWith({
      orderId: "order-1",
      expectedTotalAmount: 30.99,
    });
    expect(
      await screen.findByRole("button", { name: "Complete card payment" }),
    ).toBeInTheDocument();
  });

  it("does not create an order when delivery address is missing", async () => {
    renderPaymentPage({ city: "London", zipCode: "SW1A 1AA" });

    expect(
      await screen.findByText("Missing delivery address"),
    ).toBeInTheDocument();
    expect(checkoutCart).not.toHaveBeenCalled();
    expect(createPaymentIntent).not.toHaveBeenCalled();
  });

  it("confirms payment and navigates to order confirmation after Stripe succeeds", async () => {
    const user = userEvent.setup();
    vi.mocked(checkoutCart).mockResolvedValue({
      orderId: "order-1",
      orderNumber: "ORD-1",
      status: "PENDING",
      totalAmount: 30.99,
      estimatedDeliveryAt: null,
    });
    vi.mocked(createPaymentIntent).mockResolvedValue({
      success: true,
      message: "Payment intent created",
      data: {
        paymentId: "payment-1",
        status: "PROCESSING",
        clientSecret: "client-secret",
      },
    });
    vi.mocked(confirmPayment).mockResolvedValue({
      success: true,
      data: {
        id: "payment-1",
        orderId: "order-1",
        status: "SUCCEEDED",
        amount: 3099,
        currency: "GBP",
        paymentMethod: "CARD",
        createdAt: "2026-05-20T00:00:00.000Z",
        updatedAt: "2026-05-20T00:00:00.000Z",
      },
    });

    renderPaymentPage();

    await user.click(
      await screen.findByRole("button", { name: "Complete card payment" }),
    );

    await waitFor(() => {
      expect(confirmPayment).toHaveBeenCalledWith("payment-1");
      expect(screen.getByText("Confirmed order: ORD-1")).toBeInTheDocument();
    });
  });
});
