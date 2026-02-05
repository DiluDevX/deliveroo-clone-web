import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../types/user.types";
import { logout } from "../services/auth.service";
import { showSuccessSnackbar } from "../utils/notifications";

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
    logOut: (state) => {
      state.isAuthenticated = false;
      state.isAuthInitialized = false;
      state.user = null;
      state.token = null;
      logout();
      showSuccessSnackbar("Logged Out!");
    },
  },
});

export const { setCredentials, setAuthInitialized, logOut } = authSlice.actions;
export default authSlice.reducer;
