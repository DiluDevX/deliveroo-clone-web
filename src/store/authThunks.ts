import { AppDispatch } from "./store";
import { logOut } from "./authSlice";
import { logout } from "../services/auth.service";
import { showErrorSnackbar, showSuccessSnackbar } from "../utils/notifications";

export const logOutUser = () => async (dispatch: AppDispatch) => {
  try {
    const didLogout = await logout();
    if (!didLogout) {
      throw new Error(
        "Logged out locally, but server session revocation could not be confirmed",
      );
    }

    showSuccessSnackbar("Logged Out!");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to log out";
    showErrorSnackbar(message);
  } finally {
    dispatch(logOut());
  }
};
