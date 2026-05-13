import { store } from "../store/store";

/**
 * Get current access token from Redux store
 * Redux-persist handles localStorage persistence automatically
 */
export const getStoredAccessToken = (): string => {
  const state = store.getState();
  return state.auth?.token || "";
};

/**
 * Get current refresh token from Redux store
 * Redux-persist handles localStorage persistence automatically
 */
export const getStoredRefreshToken = (): string => {
  const state = store.getState();
  return state.auth?.refreshToken || "";
};

/**
 * Clear all tokens by dispatching Redux action
 * This is handled by authSlice logOut action
 * Do NOT call this directly - use dispatch(logOut()) instead
 */
export const clearStoredTokens = () => {
  // Tokens are cleared via Redux reducer
  // No manual localStorage manipulation needed
};

/**
 * Get Authorization Headers for API Requests
 *
 * Returns headers for authenticated requests to the BFF:
 * - Authorization: Bearer <accessToken> → Used by BFF to verify with auth-service
 * - x-api-key: <BFF_API_KEY> → Required by BFF API key middleware
 *
 * Does NOT include x-user-id, x-actor-id, x-actor-type headers.
 * These are injected by the BFF after verifying the access token.
 *
 * @returns Authorization headers object
 */
export const getAuthHeader = () => {
  const accessToken = getStoredAccessToken();

  return {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    "x-api-key": import.meta.env.VITE_BFF_API_KEY,
  };
};
