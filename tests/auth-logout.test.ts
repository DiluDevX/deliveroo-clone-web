import { beforeEach, describe, expect, it, vi } from "vitest";

const { logout, showErrorSnackbar, showSuccessSnackbar } = vi.hoisted(() => ({
  logout: vi.fn(),
  showErrorSnackbar: vi.fn(),
  showSuccessSnackbar: vi.fn(),
}));

vi.mock("../src/services/auth.service", () => ({ logout }));
vi.mock("../src/utils/notifications", () => ({
  showErrorSnackbar,
  showSuccessSnackbar,
}));

import { logOutUser } from "../src/store/authThunks";

describe("logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("clears the local session after server logout succeeds", async () => {
    logout.mockResolvedValue(true);
    const dispatch = vi.fn();

    await logOutUser()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "auth/logOut" }),
    );
    expect(showSuccessSnackbar).toHaveBeenCalledWith("Logged Out!");
    expect(showErrorSnackbar).not.toHaveBeenCalled();
  });

  it("still clears the local session when server revocation fails", async () => {
    logout.mockResolvedValue(false);
    const dispatch = vi.fn();

    await logOutUser()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "auth/logOut" }),
    );
    expect(showErrorSnackbar).toHaveBeenCalledWith(
      "Logged out locally, but server session revocation could not be confirmed",
    );
    expect(showSuccessSnackbar).not.toHaveBeenCalled();
  });
});
