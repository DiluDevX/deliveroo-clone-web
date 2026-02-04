import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    isPlatformAdmin: false,
    isRestaurantAdmin: false,
  },
  reducers: {
    setAdminStatus: (state, action) => {
      state.isPlatformAdmin = action.payload;
      state.isRestaurantAdmin = action.payload;
    },
  },
});

export const { setAdminStatus } = adminSlice.actions;
export default adminSlice.reducer;
