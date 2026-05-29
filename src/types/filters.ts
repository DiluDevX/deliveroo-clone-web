export interface FilterState {
  cuisines: string[];
  priceRange: PriceRange;
  minRating: number | null;
  deliveryTime: number | null;
  offers: boolean;
  searchQuery?: string;
}

export type PriceRange = "all" | "budget" | "mid" | "premium";

export interface CuisineOption {
  id: string;
  label: string;
  icon?: React.ComponentType;
}

export interface RatingOption {
  value: number;
  label: string;
}

export const CUISINE_OPTIONS: CuisineOption[] = [
  { id: "italian", label: "Italian" },
  { id: "asian", label: "Asian" },
  { id: "chinese", label: "Chinese" },
  { id: "indian", label: "Indian" },
  { id: "mexican", label: "Mexican" },
  { id: "vegan", label: "Vegan" },
  { id: "fast_food", label: "Fast Food" },
  { id: "pizza", label: "Pizza" },
];

export const PRICE_OPTIONS = [
  { value: "all", label: "All prices" },
  { value: "budget", label: "£ - Budget friendly" },
  { value: "mid", label: "££ - Mid range" },
  { value: "premium", label: "£££ - Premium" },
];

export const MINIMUM_ORDER_VALUE_THRESHOLDS = {
  budgetMax: 12,
  midMin: 13,
  midMax: 20,
  premiumMin: 21,
} as const;

export const RATING_OPTIONS: RatingOption[] = [
  { value: 4.5, label: "4.5+ ⭐" },
  { value: 4, label: "4.0+ ⭐" },
  { value: 3.5, label: "3.5+ ⭐" },
];

export const DELIVERY_TIME_OPTIONS = [
  { value: 20, label: "Under 20 mins" },
  { value: 30, label: "Under 30 mins" },
  { value: 45, label: "Under 45 mins" },
];
