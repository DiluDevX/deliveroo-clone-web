export const RESTAURANT_MENU_SEARCH_OPEN_EVENT = "restaurant-menu-search:open";

export const openRestaurantMenuSearch = () => {
  globalThis.dispatchEvent(new Event(RESTAURANT_MENU_SEARCH_OPEN_EVENT));
};
