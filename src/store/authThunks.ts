import { AppDispatch } from "./store";
import { logOut } from "./authSlice";
import { logout } from "../services/auth.service";
import { showSuccessSnackbar } from "../utils/notifications";

export const logOutUser = () => async (dispatch: AppDispatch) => {
  await logout();
  dispatch(logOut());
  showSuccessSnackbar("Logged Out!");
};
