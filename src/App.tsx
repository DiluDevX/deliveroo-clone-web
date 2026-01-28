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

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
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
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
};

export default App;
