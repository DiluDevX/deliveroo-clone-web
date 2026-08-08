import { beforeEach, describe, expect, it, vi } from "vitest";

const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("../src/services/api.client", () => ({
  apiClient: { post },
}));

import { provisionRestaurant } from "../src/services/admin.service";
import { restaurantFormSchema } from "../src/features/menu/validations/restaurant-form.schema";
import { ProvisionRestaurantRequestBodySchema } from "../src/types/dto/admin.dto";
import type { ProvisionRestaurantRequestBodyDTO } from "../src/types/dto/admin.dto";

const request: ProvisionRestaurantRequestBodyDTO = {
  provisioningId: "123e4567-e89b-42d3-a456-426614174000",
  restaurant: {
    name: "Test Kitchen",
    image: "https://example.com/restaurant.jpg",
    address: "1 Test Street",
    description: "A test restaurant",
    tags: ["test"],
    openingAt: "09:00",
    closingAt: "21:00",
    minimumValue: 10,
    deliveryCharge: 2,
    commissionPercentage: 15,
    cuisine: "Sri Lankan",
  },
  owner: {
    firstName: "Test Kitchen",
    lastName: "Owner",
    email: "owner@example.com",
  },
};

describe("platform restaurant provisioning service", () => {
  beforeEach(() => {
    post.mockReset();
  });

  it("sends one BFF command with the stable provisioning id", async () => {
    const restaurant = { id: "restaurant-id", ...request.restaurant };
    post.mockResolvedValue({
      data: {
        success: true,
        message: "Restaurant and owner provisioned successfully",
        data: { restaurant },
      },
    });

    await expect(provisionRestaurant(request)).resolves.toEqual(restaurant);
    expect(post).toHaveBeenCalledWith("/admin/restaurants", request);
    expect(post).toHaveBeenCalledTimes(1);
  });

  it("preserves the safe backend error message", async () => {
    post.mockRejectedValue({
      isAxiosError: true,
      response: {
        data: { message: "Email is already in use" },
      },
    });

    await expect(provisionRestaurant(request)).rejects.toThrow(
      "Email is already in use",
    );
  });

  it("rejects an invalid provisioning id before making a request", async () => {
    await expect(
      provisionRestaurant({ ...request, provisioningId: "not-a-uuid" }),
    ).rejects.toThrow();
    expect(post).not.toHaveBeenCalled();
  });

  it("trims owner email and restaurant times at the provisioning boundary", () => {
    const parsed = ProvisionRestaurantRequestBodySchema.parse({
      ...request,
      restaurant: {
        ...request.restaurant,
        openingAt: " 09:00 ",
        closingAt: " 21:00 ",
      },
      owner: {
        ...request.owner,
        email: " owner@example.com ",
        password: "must-not-cross-the-boundary",
      },
    });

    expect(parsed.restaurant.openingAt).toBe("09:00");
    expect(parsed.restaurant.closingAt).toBe("21:00");
    expect(parsed.owner.email).toBe("owner@example.com");
    expect(parsed.owner).not.toHaveProperty("password");
  });

  it("enforces description and owner-name limits in the modal", () => {
    const validForm = {
      name: "Test Kitchen",
      cuisine: "Sri Lankan",
      image: "https://example.com/restaurant.jpg",
      address: "1 Test Street",
      description: "A test restaurant",
      tags: "test",
      openingAt: "09:00",
      closingAt: "21:00",
      minimumValue: "10",
      deliveryCharge: "2",
      commissionPercentage: "15",
      ownerFirstName: "Test",
      ownerLastName: "Owner",
      adminEmail: "owner@example.com",
    };

    expect(restaurantFormSchema.safeParse(validForm).success).toBe(true);
    expect(
      restaurantFormSchema.safeParse({
        ...validForm,
        description: "x".repeat(1001),
      }).success,
    ).toBe(false);
    expect(
      restaurantFormSchema.safeParse({
        ...validForm,
        ownerFirstName: "x".repeat(51),
      }).success,
    ).toBe(false);
  });
});
