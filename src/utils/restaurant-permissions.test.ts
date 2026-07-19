import { describe, expect, it } from "vitest";
import { hasRestaurantCapability } from "./restaurant-permissions";

describe("restaurant permissions", () => {
  it("limits employees to dashboard and order operations", () => {
    expect(hasRestaurantCapability("employee", "view_dashboard")).toBe(true);
    expect(hasRestaurantCapability("employee", "manage_orders")).toBe(true);
    expect(hasRestaurantCapability("employee", "manage_menu")).toBe(false);
    expect(hasRestaurantCapability("employee", "manage_team")).toBe(false);
  });

  it("limits finance users to dashboard and analytics", () => {
    expect(hasRestaurantCapability("finance", "view_dashboard")).toBe(true);
    expect(hasRestaurantCapability("finance", "view_analytics")).toBe(true);
    expect(hasRestaurantCapability("finance", "manage_orders")).toBe(false);
  });

  it("allows restaurant admins to manage the operational dashboard", () => {
    expect(hasRestaurantCapability("admin", "manage_team")).toBe(true);
    expect(hasRestaurantCapability("super_admin", "manage_settings")).toBe(
      true,
    );
  });
});
