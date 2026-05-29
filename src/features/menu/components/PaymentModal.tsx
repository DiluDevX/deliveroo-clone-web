import {
  Alert,
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Colors } from "../../../theme/colors";
import {
  createSetupIntent,
  finalizeSetupIntent,
} from "../../../services/payment.service";
import { stripePromise } from "../../../config/stripe";
import Button from "./Button";

type PaymentModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

type SaveCardFormProps = {
  setupIntentId: string;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

const SaveCardForm = ({
  setupIntentId,
  onClose,
  onSaved,
}: SaveCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSaving, setIsSaving] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!stripe || !elements) {
      setError("Payment form is still loading.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { error: setupError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (setupError) {
        setError(setupError.message ?? "Could not save this card.");
        return;
      }

      if (setupIntent?.status !== "succeeded") {
        setError(
          `Card setup was not completed. Status: ${setupIntent?.status ?? "unknown"}`,
        );
        return;
      }

      const savedPaymentMethod = await finalizeSetupIntent(
        setupIntent.id || setupIntentId,
        setAsDefault,
      );

      if (!savedPaymentMethod) {
        setError("Card was saved by Stripe, but could not be stored here.");
        return;
      }

      await onSaved();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save this card.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            backgroundColor: Colors.background.default,
            borderRadius: 2,
          }}
        >
          <CreditCardIcon
            sx={{ fontSize: 32, color: Colors.text.placeholder }}
          />
          <Typography
            sx={{ color: Colors.text.placeholder, fontSize: "0.9rem" }}
          >
            Add a new card
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <PaymentElement options={{ wallets: { link: "never" } }} />

        <FormControlLabel
          control={
            <Checkbox
              checked={setAsDefault}
              onChange={(event) => setSetAsDefault(event.target.checked)}
              sx={{
                color: Colors.background.brand,
                "&.Mui-checked": { color: Colors.background.brand },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: "0.9rem" }}>
              Use as default card
            </Typography>
          }
        />
      </Box>

      <Divider />

      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: { xs: "column-reverse", sm: "row" },
          gap: 2,
        }}
      >
        <Button
          variant="border"
          onClick={onClose}
          disabled={isSaving}
          sx={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          onClick={handleSave}
          disabled={!stripe || !elements || isSaving}
          sx={{ flex: 1 }}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </Box>
    </>
  );
};

const PaymentModal = ({ open, onClose, onSaved }: PaymentModalProps) => {
  const [setupIntentId, setSetupIntentId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSetupIntentId(null);
      setClientSecret(null);
      setError(null);
      return;
    }

    let isActive = true;

    const prepareSetupIntent = async () => {
      const setupIntent = await createSetupIntent();

      if (!isActive) {
        return;
      }

      if (!setupIntent?.data.clientSecret) {
        setError("Could not prepare the card form.");
        return;
      }

      setSetupIntentId(setupIntent.data.setupIntentId);
      setClientSecret(setupIntent.data.clientSecret);
    };

    void prepareSetupIntent();

    return () => {
      isActive = false;
    };
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: { xs: "10px", sm: "12px" },
          width: { xs: "calc(100vw - 24px)", sm: "500px" },
          maxWidth: "500px",
          maxHeight: { xs: "calc(100dvh - 24px)", sm: "85vh" },
          m: { xs: 1.5, sm: 4 },
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${Colors.border.subtle}`,
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Add Payment Method</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, m: 0, overflowY: "auto" }}>
        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {clientSecret && setupIntentId ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <SaveCardForm
              setupIntentId={setupIntentId}
              onClose={onClose}
              onSaved={onSaved}
            />
          </Elements>
        ) : (
          <Box sx={{ p: 3 }}>
            <Typography sx={{ color: Colors.text.placeholder }}>
              Preparing secure card form...
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
