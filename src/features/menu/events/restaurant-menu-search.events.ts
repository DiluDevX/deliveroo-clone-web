export const RESTAURANT_MENU_SEARCH_OPEN_EVENT = "restaurant-menu-search:open";
export const RESTAURANT_MENU_SEARCH_LABEL_EVENT =
  "restaurant-menu-search:label";

export type RestaurantMenuSearchLabelEventDetail = {
  restaurantName: string | null;
};

export const openRestaurantMenuSearch = () => {
  globalThis.dispatchEvent(new Event(RESTAURANT_MENU_SEARCH_OPEN_EVENT));
};

export const setRestaurantMenuSearchLabel = (restaurantName: string | null) => {
  globalThis.dispatchEvent(
    new CustomEvent<RestaurantMenuSearchLabelEventDetail>(
      RESTAURANT_MENU_SEARCH_LABEL_EVENT,
      {
        detail: { restaurantName },
      },
    ),
  );
};
