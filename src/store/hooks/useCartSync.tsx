import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./cartHooks";
import { fetchCart, syncCartToServer } from "../cartSlice";

export const useCartSync = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const cartItems = useAppSelector((state) => state.cart.items);
  const previousAuthState = useRef(isAuthenticated);

  // Fetch cart from server when user logs in
  useEffect(() => {
    if (
      isAuthenticated &&
      user?.role === "user" &&
      !previousAuthState.current
    ) {
      const hadLocalCartBeforeLogin = cartItems.length > 0;

      if (hadLocalCartBeforeLogin) {
        dispatch(syncCartToServer());
      } else {
        dispatch(fetchCart());
      }
    }

    previousAuthState.current = isAuthenticated;
  }, [isAuthenticated, user?.role, cartItems.length, dispatch]);
};
