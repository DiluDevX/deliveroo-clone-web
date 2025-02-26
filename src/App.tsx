import {
  Route,
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
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
        ></Route>
        <Route
          path="/restaurants/:orgId/menu"
          element={
            <WithPageTitle title="Tossed">
              <HomePage />
            </WithPageTitle>
          }
        ></Route>
        <Route path="/account" element={<SignPageLayout />}>
          <Route
            index
            element={
              <WithPageTitle title="Account">
                <AuthPage />
              </WithPageTitle>
            }
          ></Route>
          <Route
            path="complete-signup"
            element={
              <WithPageTitle title="Complete SignUp">
                <AccountCompletionPage />
              </WithPageTitle>
            }
          ></Route>
          <Route
            path="signup"
            element={
              <WithPageTitle title="SignUp">
                <SignUpPage />
              </WithPageTitle>
            }
          ></Route>
          <Route
            path="login"
            element={
              <WithPageTitle title="Login">
                <LoginPage />
              </WithPageTitle>
            }
          ></Route>

          <Route
            path="recovery"
            element={
              <WithPageTitle title="Recover Account">
                <RecoveryPage />
              </WithPageTitle>
            }
          ></Route>
          <Route
            path="recovery-confirmation"
            element={
              <WithPageTitle title="Recovery Sent">
                <RecoveryConfirmationPage />
              </WithPageTitle>
            }
          ></Route>
        </Route>
        <Route
          path="/restaurants"
          element={
            <WithPageTitle title="All-Restaurants">
              <AllRestaurantsPage />
            </WithPageTitle>
          }
        ></Route>
        <Route
          path="/filtered-restaurants"
          element={
            <WithPageTitle title="Restaurants">
              <FilteredRestaurantsPage />
            </WithPageTitle>
          }
        ></Route>
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
};

export default App;
