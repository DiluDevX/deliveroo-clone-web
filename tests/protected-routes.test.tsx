import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import ProtectedRoute from "../src/routes/ProtectedRoute";
import AdminProtectedRoute from "../src/routes/AdminProtectedRoute";
import RestaurantAdminProtectedRoute from "../src/routes/RestaurantAdminProtectedRoute";
import { renderWithProviders } from "./test-utils";

const ProtectedRouteHarness = () => (
  <MemoryRouter initialEntries={["/checkout"]}>
    <Routes>
      <Route path="/account/login" element={<div>Login page</div>} />
      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<div>Checkout page</div>} />
      </Route>
    </Routes>
  </MemoryRouter>
);

const AdminRouteHarness = () => (
  <MemoryRouter initialEntries={["/admin"]}>
    <Routes>
      <Route path="/account/login" element={<div>Login page</div>} />
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<div>Admin dashboard</div>} />
      </Route>
    </Routes>
  </MemoryRouter>
);

const RestaurantAdminRouteHarness = () => (
  <MemoryRouter initialEntries={["/restaurant-admin"]}>
    <Routes>
      <Route path="/account/login" element={<div>Login page</div>} />
      <Route element={<RestaurantAdminProtectedRoute />}>
        <Route
          path="/restaurant-admin"
          element={<div>Restaurant dashboard</div>}
        />
      </Route>
    </Routes>
  </MemoryRouter>
);

describe("protected routes", () => {
  it("renders nothing while auth initialization is pending", () => {
    const { container } = renderWithProviders(<ProtectedRouteHarness />, {
      preloadedState: {
        auth: {
          isAuthInitialized: false,
          isAuthenticated: false,
        },
      },
    });

    expect(container).toBeEmptyDOMElement();
  });

  it("redirects unauthenticated customers to login", () => {
    renderWithProviders(<ProtectedRouteHarness />, {
      preloadedState: {
        auth: {
          isAuthInitialized: true,
          isAuthenticated: false,
        },
      },
    });

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Checkout page")).not.toBeInTheDocument();
  });

  it("allows authenticated customers through", () => {
    renderWithProviders(<ProtectedRouteHarness />, {
      preloadedState: {
        auth: {
          isAuthInitialized: true,
          isAuthenticated: true,
        },
      },
    });

    expect(screen.getByText("Checkout page")).toBeInTheDocument();
  });

  it("requires the platform admin role for admin routes", () => {
    renderWithProviders(<AdminRouteHarness />, {
      preloadedState: {
        auth: {
          isAuthInitialized: true,
          isAuthenticated: true,
          user: {
            firstName: "Customer",
            lastName: "User",
            email: "customer@example.com",
            role: "customer",
          },
        },
      },
    });

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Admin dashboard")).not.toBeInTheDocument();
  });

  it("allows platform admins through admin routes", () => {
    renderWithProviders(<AdminRouteHarness />, {
      preloadedState: {
        auth: {
          isAuthInitialized: true,
          isAuthenticated: true,
          user: {
            firstName: "Platform",
            lastName: "Admin",
            email: "admin@example.com",
            role: "platform_admin",
          },
        },
      },
    });

    expect(screen.getByText("Admin dashboard")).toBeInTheDocument();
  });

  it("redirects restaurant users without a restaurant id", () => {
    renderWithProviders(<RestaurantAdminRouteHarness />, {
      preloadedState: {
        auth: {
          isAuthInitialized: true,
          isAuthenticated: true,
          user: {
            firstName: "Restaurant",
            lastName: "User",
            email: "restaurant-user@example.com",
            role: "restaurant_user",
          },
        },
      },
    });

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Restaurant dashboard")).not.toBeInTheDocument();
  });

  it("allows restaurant users with a restaurant id through", () => {
    renderWithProviders(<RestaurantAdminRouteHarness />, {
      preloadedState: {
        auth: {
          isAuthInitialized: true,
          isAuthenticated: true,
          user: {
            firstName: "Restaurant",
            lastName: "User",
            email: "restaurant-user@example.com",
            role: "restaurant_user",
            restaurantId: "restaurant-1",
          },
        },
      },
    });

    expect(screen.getByText("Restaurant dashboard")).toBeInTheDocument();
  });
});
