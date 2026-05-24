import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { Colors } from "../../../theme";
import Button from "./Button";

type PopUpDialogProps = {
  open: boolean;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  danger?: boolean;
  loading?: boolean;
  disableClose?: boolean;
  actionsDirection?: "row" | "column";
  maxWidth?: string;
  onClose: () => void;
  onConfirm?: () => void;
  paperSx?: SxProps<Theme>;
};

const PopUpDialog = ({
  open,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loadingLabel,
  danger = false,
  loading = false,
  disableClose = false,
  actionsDirection = "row",
  maxWidth = "420px",
  onClose,
  onConfirm,
  paperSx,
}: PopUpDialogProps) => {
  const handleClose = () => {
    if (!disableClose && !loading) {
      onClose();
    }
  };

  const cancelButton = (
    <Button
      variant="border"
      onClick={onClose}
      disabled={loading}
      sx={{
        flex: actionsDirection === "row" ? undefined : 1,
        width: actionsDirection === "column" ? "100%" : undefined,
        fontWeight: "bold",
      }}
    >
      {cancelLabel}
    </Button>
  );

  const confirmButton = onConfirm ? (
    <Button
      variant="filled"
      onClick={onConfirm}
      disabled={loading}
      sx={{
        flex: actionsDirection === "row" ? undefined : 1,
        width: actionsDirection === "column" ? "100%" : undefined,
        fontWeight: "bold",
        ...(danger
          ? {
              backgroundColor: Colors.background.danger,
              "&:hover": {
                backgroundColor: Colors.background.dangerHover,
              },
            }
          : {}),
      }}
    >
      {loading ? (loadingLabel ?? `${confirmLabel}...`) : confirmLabel}
    </Button>
  ) : null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          maxWidth,
          width: "calc(100% - 32px)",
          ...paperSx,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          color: danger ? Colors.background.danger : Colors.text.default,
          textAlign: actionsDirection === "column" ? "center" : "left",
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent>
        {description && typeof description === "string" ? (
          <Typography
            sx={{
              color: Colors.text.default,
              textAlign: actionsDirection === "column" ? "center" : "left",
            }}
          >
            {description}
          </Typography>
        ) : (
          description
        )}
        {children}
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          flexDirection: actionsDirection,
          gap: 1,
          px: 3,
          pb: 2,
        }}
      >
        {actionsDirection === "column" ? (
          <>
            {confirmButton}
            {cancelButton}
          </>
        ) : (
          <>
            {cancelButton}
            {confirmButton}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PopUpDialog;
