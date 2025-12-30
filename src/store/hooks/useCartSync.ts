import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./cartHooks";
import { fetchCart, syncCartToServer } from "../cartSlice";

export const useCartSync = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const previousAuthState = useRef(isAuthenticated);

  // Fetch cart from server when user logs in
  useEffect(() => {
    if (isAuthenticated && !previousAuthState.current) {
      // User just logged in - fetch and merge cart from server
      dispatch(fetchCart()).then(() => {
        // Sync merged cart back to server
        dispatch(syncCartToServer());
      });
    }

    previousAuthState.current = isAuthenticated;
  }, [isAuthenticated, dispatch]);
};
