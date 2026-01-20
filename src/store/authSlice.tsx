import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../types/user.types";

export interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
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
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
