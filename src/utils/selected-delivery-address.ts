import { Address } from "../types/user.types";

export const SELECTED_DELIVERY_ADDRESS_CHANGED =
  "selected-delivery-address-changed";

const SELECTED_DELIVERY_ADDRESS_ID_KEY = "selected-delivery-address-id";
const SELECTED_DELIVERY_ADDRESS_LABEL_KEY = "selected-delivery-address-label";

export const getSelectedDeliveryAddress = () => {
  const addressId = localStorage.getItem(SELECTED_DELIVERY_ADDRESS_ID_KEY);
  const label = localStorage.getItem(SELECTED_DELIVERY_ADDRESS_LABEL_KEY);

  return addressId ? { addressId, label } : null;
};

export const setSelectedDeliveryAddress = (address: Address) => {
  localStorage.setItem(SELECTED_DELIVERY_ADDRESS_ID_KEY, address.id);
  localStorage.setItem(SELECTED_DELIVERY_ADDRESS_LABEL_KEY, address.label);
  globalThis.dispatchEvent(new Event(SELECTED_DELIVERY_ADDRESS_CHANGED));
};

export const clearSelectedDeliveryAddress = () => {
  localStorage.removeItem(SELECTED_DELIVERY_ADDRESS_ID_KEY);
  localStorage.removeItem(SELECTED_DELIVERY_ADDRESS_LABEL_KEY);
  globalThis.dispatchEvent(new Event(SELECTED_DELIVERY_ADDRESS_CHANGED));
};
