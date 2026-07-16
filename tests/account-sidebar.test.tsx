import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import AccountSideBar from "../src/features/menu/components/AccountSideBar";
import { renderWithProviders } from "./test-utils";

describe("AccountSideBar", () => {
  it("shows operational navigation instead of customer actions for restaurant staff", () => {
    renderWithProviders(
      <MemoryRouter>
        <AccountSideBar open toggleDrawer={vi.fn()} />
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            isAuthenticated: true,
            isAuthInitialized: true,
            user: {
              firstName: "Restaurant",
              lastName: "Staff",
              email: "staff@example.com",
              role: "restaurant_user",
              restaurantId: "restaurant-1",
            },
          },
        },
      },
    );

    expect(
      screen.getByRole("button", { name: /Dashboard/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Cart$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Orders$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Saved Addresses/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Payments$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Settings$/i }),
    ).not.toBeInTheDocument();
  });
});
