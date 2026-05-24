import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../types/user.types";

export interface AuthState {
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  user: IUser | null;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthInitialized: false,
  user: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user?: IUser;
        accessToken?: string;
        refreshToken?: string;
      }>,
    ) => {
      const { user, accessToken, refreshToken } = action.payload;

      if (user) {
        state.user = user;
        state.isAuthenticated = true;
      }

      if (accessToken !== undefined) {
        state.token = accessToken;
        state.isAuthenticated = true;
      }

      if (refreshToken !== undefined) {
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
      }

      if (!user && accessToken === undefined && refreshToken === undefined) {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      }
    },

    setAuthInitialized: (state, action: PayloadAction<boolean>) => {
      state.isAuthInitialized = action.payload;
    },
    logOut: (state) => {
      state.isAuthenticated = false;
      state.isAuthInitialized = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, setAuthInitialized, logOut } = authSlice.actions;
export default authSlice.reducer;
