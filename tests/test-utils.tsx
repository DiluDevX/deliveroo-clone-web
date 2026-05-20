import { configureStore } from "@reduxjs/toolkit";
import { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { render, RenderOptions } from "@testing-library/react";
import authReducer, { AuthState } from "../src/store/authSlice";
import cartReducer, { CartState } from "../src/store/cartSlice";
import adminReducer from "../src/store/adminSlice";

type AdminState = {
  isPlatformAdmin: boolean;
  isRestaurantAdmin: boolean;
};

type TestPreloadedState = {
  auth?: Partial<AuthState>;
  cart?: Partial<CartState>;
  admin?: Partial<AdminState>;
};

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  isAuthInitialized: true,
  user: null,
  token: null,
  refreshToken: null,
};

const defaultCartState: CartState = {
  items: [],
  isLoading: false,
  isSyncing: false,
};

const defaultAdminState: AdminState = {
  isPlatformAdmin: false,
  isRestaurantAdmin: false,
};

type RenderWithProvidersOptions = Omit<RenderOptions, "wrapper"> & {
  preloadedState?: TestPreloadedState;
};

export const createTestStore = (preloadedState?: TestPreloadedState) =>
  configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      admin: adminReducer,
    },
    preloadedState: {
      auth: { ...defaultAuthState, ...preloadedState?.auth },
      cart: { ...defaultCartState, ...preloadedState?.cart },
      admin: { ...defaultAdminState, ...preloadedState?.admin },
    },
  });

export type TestStore = ReturnType<typeof createTestStore>;

export const renderWithProviders = (
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
) => {
  const { preloadedState, ...renderOptions } = options;
  const store = createTestStore(preloadedState);

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
