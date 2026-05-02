import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../types/user.types";
import { logout } from "../services/auth.service";

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
      if (action.payload.user) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken || state.token;
        state.refreshToken = action.payload.refreshToken || state.refreshToken;
      } else {
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
      logout();
    },
  },
});

export const { setCredentials, setAuthInitialized, logOut } = authSlice.actions;
export default authSlice.reducer;
