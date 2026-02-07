import { useAppSelector } from "./cartHooks";

export const useRestaurantId = () => {
  const user = useAppSelector((state) => state.auth.user);
  return user?.restaurantId || null;
};
