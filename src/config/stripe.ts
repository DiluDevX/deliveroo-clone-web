import { loadStripe } from "@stripe/stripe-js";

/**
 * Load Stripe.js asynchronously
 * Uses the publishable key from environment variables
 */
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.warn(
    "Stripe publishable key not found. Payments will not work. " +
      "Add VITE_STRIPE_PUBLISHABLE_KEY to .env file",
  );
}

export const stripePromise = loadStripe(publishableKey);
