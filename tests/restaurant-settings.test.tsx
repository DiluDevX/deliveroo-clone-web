import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RestaurantSettingsPage from "../src/pages/restaurant/RestaurantSettingsPage";
import {
  getSingleRestaurant,
  updateRestaurant,
} from "../src/services/restaurant.service";
import { Restaurant } from "../src/types/restaurants";
import { renderWithProviders } from "./test-utils";

vi.mock("../src/services/restaurant.service", () => ({
  getSingleRestaurant: vi.fn(),
  updateRestaurant: vi.fn(),
}));

const restaurant: Restaurant = {
  id: "restaurant-1",
  name: "Fiesta Burrito Co.",
  image: "https://example.com/fiesta.jpg",
  address: "29 Marine Drive, Bambalapitiya",
  description: "Big burritos and spicy salsa sides.",
  tags: ["Mexican", "Burritos", "Nachos"],
  openingAt: "00:00",
  closingAt: "23:59",
  minimumValue: 14,
  deliveryCharge: 2.25,
  cuisine: "Mexican",
  status: "ACTIVE",
};

const renderSettings = (restaurantRole: "admin" | "employee") =>
  renderWithProviders(<RestaurantSettingsPage />, {
    preloadedState: {
      auth: {
        isAuthenticated: true,
        isAuthInitialized: true,
        user: {
          firstName: "Restaurant",
          lastName: "Staff",
          email: "staff@example.com",
          role: "restaurant_user",
          restaurantId: restaurant.id,
          restaurantRole,
        },
      },
    },
  });

describe("RestaurantSettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSingleRestaurant).mockResolvedValue(restaurant);
    vi.mocked(updateRestaurant).mockResolvedValue(restaurant);
  });

  it("loads persisted restaurant settings and submits validated changes", async () => {
    const user = userEvent.setup();
    renderSettings("admin");

    const nameInput = await screen.findByRole("textbox", {
      name: "Restaurant name",
    });
    expect(nameInput).toHaveValue("Fiesta Burrito Co.");
    expect(screen.queryByDisplayValue("Pizza Palace")).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Fiesta Burrito Co. preview" }),
    ).toHaveAttribute("src", restaurant.image);

    const cuisineInput = screen.getByRole("textbox", { name: "Cuisine" });
    const imageInput = screen.getByRole("textbox", {
      name: "Restaurant image URL",
    });
    await user.clear(cuisineInput);
    await user.type(cuisineInput, "Mexican fusion");
    await user.clear(imageInput);
    await user.type(imageInput, "https://example.com/fiesta-updated.jpg");
    expect(
      screen.getByRole("img", { name: "Fiesta Burrito Co. preview" }),
    ).toHaveAttribute("src", "https://example.com/fiesta-updated.jpg");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(updateRestaurant).toHaveBeenCalledWith(restaurant.id, {
        name: restaurant.name,
        cuisine: "Mexican fusion",
        description: restaurant.description,
        address: restaurant.address,
        image: "https://example.com/fiesta-updated.jpg",
        tags: restaurant.tags,
        openingAt: restaurant.openingAt,
        closingAt: restaurant.closingAt,
        minimumValue: restaurant.minimumValue,
        deliveryCharge: restaurant.deliveryCharge,
      });
    });
  });

  it("keeps settings read-only for non-admin restaurant staff", async () => {
    renderSettings("employee");

    expect(
      await screen.findByText(
        "Restaurant settings are read-only for your staff role.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Restaurant name" }),
    ).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "Save changes" }),
    ).not.toBeInTheDocument();
  });
});
