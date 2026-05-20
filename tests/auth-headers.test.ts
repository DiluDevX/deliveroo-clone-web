import { afterEach, describe, expect, it, vi } from "vitest";
import { getAuthHeader } from "../src/services/auth-headers";
import { setCredentials } from "../src/store/authSlice";
import { store } from "../src/store/store";

describe("auth headers", () => {
  afterEach(() => {
    store.dispatch(setCredentials({}));
    vi.unstubAllEnvs();
  });

  it("sends the BFF API key without privileged actor headers", () => {
    vi.stubEnv("VITE_BFF_API_KEY", "public-bff-key");

    expect(getAuthHeader()).toEqual({
      "x-api-key": "public-bff-key",
    });
  });

  it("includes the Bearer token when the user is authenticated", () => {
    vi.stubEnv("VITE_BFF_API_KEY", "public-bff-key");
    store.dispatch(
      setCredentials({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      }),
    );

    expect(getAuthHeader()).toEqual({
      Authorization: "Bearer access-token",
      "x-api-key": "public-bff-key",
    });
    expect(getAuthHeader()).not.toHaveProperty("x-user-id");
    expect(getAuthHeader()).not.toHaveProperty("x-actor-id");
    expect(getAuthHeader()).not.toHaveProperty("x-actor-type");
  });
});
