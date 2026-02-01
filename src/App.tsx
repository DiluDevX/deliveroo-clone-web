import {
  Route,
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import MainLayout from "./layout/MainLayout";
import WithPageTitle from "./hocs/WithPageTitle";
import LandingPage from "./pages/LandingPage";
import AllRestaurantsPage from "./pages/AllRestaurantsPage";
import FilteredRestaurantsPage from "./pages/FilteredRestaurantsPage";
import SignUpPage from "./pages/SignUpPage";
import SignPageLayout from "./layout/SignPageLayout";
import LoginPage from "./pages/LoginPage";
import AccountCompletionPage from "./pages/AccountCompletionPage";
import RecoveryPage from "./pages/RecoveryPage";
import RecoveryConfirmationPage from "./pages/RecoveryConfirmationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MenuPage from "./pages/MenuPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import DataDeletionPage from "./pages/DataDeletionPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminRestaurantsPage from "./pages/admin/AdminRestaurantsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminDishesPage from "./pages/admin/AdminDishesPage";
import AdminRoute from "./routes/AdminRoute";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            index
            element={
              <WithPageTitle title="Home">
                <LandingPage />
              </WithPageTitle>
            }
          />
          <Route
            path="/restaurants/:orgId/menu"
            element={
              <WithPageTitle title="Tossed">
                <MenuPage />
              </WithPageTitle>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/checkout"
              element={
                <WithPageTitle title="Checkout">
                  <CheckoutPage />
                </WithPageTitle>
              }
            />
          </Route>
          <Route path="/account" element={<SignPageLayout />}>
            <Route
              index
              element={
                <WithPageTitle title="Account">
                  <AuthPage />
                </WithPageTitle>
              }
            />
            <Route
              path="complete-signup"
              element={
                <WithPageTitle title="Complete SignUp">
                  <AccountCompletionPage />
                </WithPageTitle>
              }
            />
            <Route
              path="reset-password"
              element={
                <WithPageTitle title="Reset Password">
                  <ResetPasswordPage />
                </WithPageTitle>
              }
            />
            <Route
              path="signup"
              element={
                <WithPageTitle title="SignUp">
                  <SignUpPage />
                </WithPageTitle>
              }
            />
            <Route
              path="login"
              element={
                <WithPageTitle title="Login">
                  <LoginPage />
                </WithPageTitle>
              }
            />
            <Route
              path="recovery"
              element={
                <WithPageTitle title="Recover Account">
                  <RecoveryPage />
                </WithPageTitle>
              }
            />
            <Route
              path="recovery-confirmation"
              element={
                <WithPageTitle title="Recovery Sent">
                  <RecoveryConfirmationPage />
                </WithPageTitle>
              }
            />
          </Route>
          <Route
            path="/restaurants"
            element={
              <WithPageTitle title="All-Restaurants">
                <AllRestaurantsPage />
              </WithPageTitle>
            }
          />
          <Route
            path="/filtered-restaurants"
            element={
              <WithPageTitle title="Restaurants">
                <FilteredRestaurantsPage />
              </WithPageTitle>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <WithPageTitle title="Privacy Policy">
                <PrivacyPolicyPage />
              </WithPageTitle>
            }
          />
          <Route
            path="/data-deletion"
            element={
              <WithPageTitle title="Data Deletion">
                <DataDeletionPage />
              </WithPageTitle>
            }
          />
        </Route>
        ,
        <Route element={<AdminLayout />}>
          <Route element={<AdminRoute />}>
            <Route
              index
              path="/admin/dashboard"
              element={
                <WithPageTitle title="Admin Dashboard">
                  <AdminDashboardPage />
                </WithPageTitle>
              }
            />
            <Route
              path="/admin/restaurants"
              element={
                <WithPageTitle title="Admin Restaurants">
                  <AdminRestaurantsPage />
                </WithPageTitle>
              }
            />
            <Route
              path="/admin/dishes"
              element={
                <WithPageTitle title="Admin Dishes">
                  <AdminDishesPage />
                </WithPageTitle>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <WithPageTitle title="Admin Orders">
                  <AdminOrdersPage />
                </WithPageTitle>
              }
            />
          </Route>
        </Route>
      </>,
    ),
  );
  return <RouterProvider router={router} />;
};

export default App;
