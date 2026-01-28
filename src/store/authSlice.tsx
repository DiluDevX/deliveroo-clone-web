import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../types/user.types";

export interface AuthState {
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  user: IUser | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthInitialized: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user?: IUser }>) => {
      if (action.payload.user) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
      } else {
        state.isAuthenticated = false;
        state.user = null;
      }
    },
    setAuthInitialized: (state, action: PayloadAction<boolean>) => {
      state.isAuthInitialized = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isAuthInitialized = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, setAuthInitialized, logout } =
  authSlice.actions;
export default authSlice.reducer;
