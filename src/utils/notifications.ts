import { toast } from "sonner";

export const showErrorSnackbar = (message: string = "Something went wrong") => {
  toast.error(message);
};

export const showSuccessSnackbar = (message: string) => {
  toast.success(message);
};

export const showWarningSnackbar = (message: string) => {
  toast.warning(message);
};

export const showInfoSnackbar = (message: string) => {
  toast.info(message);
};
