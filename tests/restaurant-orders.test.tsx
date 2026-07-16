import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RestaurantOrdersPage from "../src/pages/restaurant/RestaurantOrdersPage";
import {
  getRestaurantOrders,
  updateRestaurantOrderStatus,
} from "../src/services/restaurant-admin.service";
import { Order } from "../src/types/order.types";
import { renderWithProviders } from "./test-utils";

vi.mock("../src/services/restaurant-admin.service", () => ({
  getRestaurantOrders: vi.fn(),
  updateRestaurantOrderStatus: vi.fn(),
}));

const order: Order = {
  id: "order-1",
  orderNumber: "DASH-FIESTA-002",
  userId: "customer-123456",
  restaurantId: "restaurant-1",
  driverId: null,
  status: "CONFIRMED",
  paymentStatus: "SUCCEEDED",
  paymentId: "payment-1",
  paymentMethod: "card",
  paymentExpiresAt: null,
  subtotal: 10,
  deliveryFee: 2,
  serviceFee: 1,
  discountAmount: 0,
  totalAmount: 13,
  deliveryAddress: {
    line1: "29 Marine Drive",
    city: "Colombo",
    postcode: "00300",
    country: "Sri Lanka",
  },
  restaurantName: "Fiesta Burrito Co.",
  restaurantAddress: "29 Marine Drive, Colombo",
  estimatedDeliveryAt: null,
  actualDeliveryAt: null,
  promoCode: null,
  cancelledAt: null,
  cancellationActor: null,
  cancellationReason: null,
  items: [
    {
      id: "item-1",
      dishId: "dish-1",
      dishName: "Chipotle Chicken Burrito",
      dishImageUrl: "https://example.com/burrito.jpg",
      dishCategory: "Burritos",
      unitPrice: 10,
      quantity: 1,
      lineTotal: 10,
      modifiers: [],
    },
  ],
  statusHistory: [],
  createdAt: "2026-07-16T18:17:00.000Z",
  updatedAt: "2026-07-16T18:17:00.000Z",
};

const renderOrders = () =>
  renderWithProviders(<RestaurantOrdersPage />, {
    preloadedState: {
      auth: {
        isAuthenticated: true,
        isAuthInitialized: true,
        user: {
          firstName: "Restaurant",
          lastName: "Admin",
          email: "restaurant.admin@foodflow.test",
          role: "restaurant_user",
          restaurantId: order.restaurantId,
          restaurantRole: "admin",
        },
      },
    },
  });

describe("RestaurantOrdersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getRestaurantOrders).mockResolvedValue({
      orders: [order],
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
    vi.mocked(updateRestaurantOrderStatus).mockResolvedValue({
      ...order,
      status: "PREPARING",
    });
  });

  it("opens order details from the row and displays the dish image", async () => {
    const user = userEvent.setup();
    renderOrders();

    const row = await screen.findByRole("row", {
      name: `View order ${order.orderNumber}`,
    });
    expect(
      screen.queryByRole("button", { name: "View" }),
    ).not.toBeInTheDocument();

    await user.click(row);

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("img", { name: order.items[0].dishName }),
    ).toHaveAttribute("src", order.items[0].dishImageUrl);
  });

  it("updates status without opening the order dialog", async () => {
    const user = userEvent.setup();
    renderOrders();

    await user.click(
      await screen.findByRole("button", { name: "Mark Preparing" }),
    );

    await waitFor(() => {
      expect(updateRestaurantOrderStatus).toHaveBeenCalledWith(
        order.id,
        "PREPARING",
      );
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
