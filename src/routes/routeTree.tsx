import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import RootLayout from "../layout/RootLayout";
import SignPageLayout from "../layout/SignPageLayout";
import WithPageTitle from "../hocs/WithPageTitle";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import RestaurantAdminProtectedRoute from "./RestaurantAdminProtectedRoute";

import LandingPage from "../pages/LandingPage";
import AllRestaurantsPage from "../pages/AllRestaurantsPage";
import FilteredRestaurantsPage from "../pages/FilteredRestaurantsPage";
import SignUpPage from "../pages/SignUpPage";
import LoginPage from "../pages/LoginPage";
import AccountCompletionPage from "../pages/AccountCompletionPage";
import RecoveryPage from "../pages/RecoveryPage";
import RecoveryConfirmationPage from "../pages/RecoveryConfirmationPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import MenuPage from "../pages/MenuPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import DataDeletionPage from "../pages/DataDeletionPage";
import CheckoutPage from "../pages/CheckoutPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminRestaurantsPage from "../pages/admin/AdminRestaurantsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminFinancePage from "../pages/admin/AdminFinancePage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import RestaurantDashboardPage from "../pages/restaurant/RestaurantDashboardPage";
import RestaurantOrdersPage from "../pages/restaurant/RestaurantOrdersPage";
import RestaurantMenuPage from "../pages/restaurant/RestaurantMenuPage";
import RestaurantAnalyticsPage from "../pages/restaurant/RestaurantAnalyticsPage";
import RestaurantSettingsPage from "../pages/restaurant/RestaurantSettingsPage";
import AuthPage from "../pages/AuthPage";
import NotFoundPage from "../pages/NotFoundPage";

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

// Main layout routes
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <WithPageTitle title="Tossed">
      <LandingPage />
    </WithPageTitle>
  ),
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/restaurants/$restaurantId/menu`,
  component: () => (
    <WithPageTitle title={localStorage.getItem("restaurantName") || "Menu"}>
      <MenuPage />
    </WithPageTitle>
  ),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: ProtectedRoute,
});

const checkoutIndexRoute = createRoute({
  getParentRoute: () => checkoutRoute,
  path: "",
  id: "checkoutIndex",
  component: () => (
    <WithPageTitle title="Checkout">
      <CheckoutPage />
    </WithPageTitle>
  ),
});

// Account layout and routes
const accountLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: SignPageLayout,
});

const authPageRoute = createRoute({
  getParentRoute: () => accountLayoutRoute,
  path: "",
  id: "authPage",
  component: () => (
    <WithPageTitle title="Login or SignUp">
      <AuthPage />
    </WithPageTitle>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => accountLayoutRoute,
  path: "/login",
  component: () => (
    <WithPageTitle title="Login">
      <LoginPage />
    </WithPageTitle>
  ),
});

const signupRoute = createRoute({
  getParentRoute: () => accountLayoutRoute,
  path: "/signup",
  component: () => (
    <WithPageTitle title="SignUp">
      <SignUpPage />
    </WithPageTitle>
  ),
});

const completeSignupRoute = createRoute({
  getParentRoute: () => accountLayoutRoute,
  path: "/complete-signup",
  component: () => (
    <WithPageTitle title="Complete SignUp">
      <AccountCompletionPage />
    </WithPageTitle>
  ),
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => accountLayoutRoute,
  path: "/reset-password",
  component: () => (
    <WithPageTitle title="Reset Password">
      <ResetPasswordPage />
    </WithPageTitle>
  ),
});

const recoveryRoute = createRoute({
  getParentRoute: () => accountLayoutRoute,
  path: "/recovery",
  component: function RecoveryRouteComponent() {
    return (
      <WithPageTitle title="Recover Account">
        <RecoveryPage />
      </WithPageTitle>
    );
  },
});

const recoveryConfirmationRoute = createRoute({
  getParentRoute: () => accountLayoutRoute,
  path: "/recovery-confirmation",
  component: () => (
    <WithPageTitle title="Recovery Sent">
      <RecoveryConfirmationPage />
    </WithPageTitle>
  ),
});

const restaurantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restaurants",
  component: () => (
    <WithPageTitle title="All-Restaurants">
      <AllRestaurantsPage />
    </WithPageTitle>
  ),
});

const filteredRestaurantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/filtered-restaurants",
  component: () => (
    <WithPageTitle title="Restaurants">
      <FilteredRestaurantsPage />
    </WithPageTitle>
  ),
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: () => (
    <WithPageTitle title="Privacy Policy">
      <PrivacyPolicyPage />
    </WithPageTitle>
  ),
});

const dataDeletionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/data-deletion",
  component: () => (
    <WithPageTitle title="Data Deletion">
      <DataDeletionPage />
    </WithPageTitle>
  ),
});

// Admin layout and routes
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => <Outlet />,
});

const adminProtectedRoute = createRoute({
  id: "adminProtectedRoute",
  path: "",
  getParentRoute: () => adminLayoutRoute,
  component: AdminProtectedRoute,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminProtectedRoute,
  path: "/dashboard",
  component: () => (
    <WithPageTitle title="Admin Dashboard">
      <AdminDashboardPage />
    </WithPageTitle>
  ),
});

const adminRestaurantsRoute = createRoute({
  getParentRoute: () => adminProtectedRoute,
  path: "/restaurants",
  component: () => (
    <WithPageTitle title="Admin Restaurants">
      <AdminRestaurantsPage />
    </WithPageTitle>
  ),
});

const adminFinanceRoute = createRoute({
  getParentRoute: () => adminProtectedRoute,
  path: "/finance",
  component: () => (
    <WithPageTitle title="Admin Finance">
      <AdminFinancePage />
    </WithPageTitle>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminProtectedRoute,
  path: "/orders",
  component: () => (
    <WithPageTitle title="Admin Orders">
      <AdminOrdersPage />
    </WithPageTitle>
  ),
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminProtectedRoute,
  path: "/settings",
  component: () => (
    <WithPageTitle title="Admin Settings">
      <AdminSettingsPage />
    </WithPageTitle>
  ),
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminProtectedRoute,
  path: "/users",
  component: () => (
    <WithPageTitle title="Admin Users">
      <AdminUsersPage />
    </WithPageTitle>
  ),
});

// Restaurant Admin layout and routes
const restaurantAdminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restaurant",
  component: () => <Outlet />,
});

const restaurantAdminProtectedRoute = createRoute({
  id: "restaurantAdminProtectedRoute",
  path: "",
  getParentRoute: () => restaurantAdminLayoutRoute,
  component: RestaurantAdminProtectedRoute,
});

const restaurantDashboardRoute = createRoute({
  getParentRoute: () => restaurantAdminProtectedRoute,
  path: "/dashboard",
  component: () => (
    <WithPageTitle title="Restaurant Dashboard">
      <RestaurantDashboardPage />
    </WithPageTitle>
  ),
});

const restaurantOrdersRoute = createRoute({
  getParentRoute: () => restaurantAdminProtectedRoute,
  path: "/orders",
  component: () => (
    <WithPageTitle title="Restaurant Orders">
      <RestaurantOrdersPage />
    </WithPageTitle>
  ),
});

const restaurantMenuRoute = createRoute({
  getParentRoute: () => restaurantAdminProtectedRoute,
  path: "/menu",
  component: () => (
    <WithPageTitle title="Restaurant Menu">
      <RestaurantMenuPage />
    </WithPageTitle>
  ),
});

const restaurantAnalyticsRoute = createRoute({
  getParentRoute: () => restaurantAdminProtectedRoute,
  path: "/analytics",
  component: () => (
    <WithPageTitle title="Restaurant Analytics">
      <RestaurantAnalyticsPage />
    </WithPageTitle>
  ),
});

const restaurantSettingsRoute = createRoute({
  getParentRoute: () => restaurantAdminProtectedRoute,
  path: "/settings",
  component: () => (
    <WithPageTitle title="Restaurant Settings">
      <RestaurantSettingsPage />
    </WithPageTitle>
  ),
});

// Build route tree
const routeTree = rootRoute.addChildren([
  landingRoute,
  menuRoute,
  checkoutRoute.addChildren([checkoutIndexRoute]),
  accountLayoutRoute.addChildren([
    authPageRoute,
    loginRoute,
    signupRoute,
    completeSignupRoute,
    resetPasswordRoute,
    recoveryRoute,
    recoveryConfirmationRoute,
  ]),
  restaurantsRoute,
  filteredRestaurantsRoute,
  privacyPolicyRoute,
  dataDeletionRoute,
  adminLayoutRoute.addChildren([
    adminProtectedRoute.addChildren([
      adminDashboardRoute,
      adminRestaurantsRoute,
      adminFinanceRoute,
      adminOrdersRoute,
      adminSettingsRoute,
      adminUsersRoute,
    ]),
  ]),
  restaurantAdminLayoutRoute.addChildren([
    restaurantAdminProtectedRoute.addChildren([
      restaurantDashboardRoute,
      restaurantOrdersRoute,
      restaurantMenuRoute,
      restaurantAnalyticsRoute,
      restaurantSettingsRoute,
    ]),
  ]),
]);

export { routeTree };
