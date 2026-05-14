import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Colors } from "../../../theme/colors";
import Button from "./Button";
import TextInput from "./TextInput";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

type PaymentModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: PaymentFormValues) => Promise<boolean>;
};

type PaymentFormValues = {
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
};

const PaymentModal = ({ open, onClose, onSave }: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const schema = z.object({
    cardNumber: z.string().min(1, "Card number is required"),
    expiry: z.string().min(1, "Expiry date is required"),
    cvc: z.string().min(1, "CVC is required"),
    name: z.string().min(1, "Name is required"),
  });

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cardNumber: "",
      expiry: "",
      cvc: "",
      name: "",
    },
  });

  const handleSave = async (values: PaymentFormValues) => {
    setIsLoading(true);
    try {
      const success = await onSave(values);
      if (success) {
        onClose();
        form.reset();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          position: "fixed",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "500px" },
          maxWidth: "500px",
          maxHeight: "85vh",
          overflowY: "auto",
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
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
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

          <Controller
            name="cardNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                fullWidth
                label="Card number"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={fieldState.error?.message}
                placeholder="1234 5678 9012 3456"
              />
            )}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Controller
              name="expiry"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  fullWidth
                  label="Expiry"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={fieldState.error?.message}
                  placeholder="MM/YY"
                />
              )}
            />

            <Controller
              name="cvc"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  fullWidth
                  label="CVC"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={fieldState.error?.message}
                  placeholder="123"
                />
              )}
            />
          </Box>

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                fullWidth
                label="Name on card"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={fieldState.error?.message}
                placeholder="John Doe"
              />
            )}
          />
        </Box>

        <Divider />

        <Box sx={{ p: 2, display: "flex", gap: 2 }}>
          <Button variant="border" onClick={onClose} sx={{ flex: 1 }}>
            Cancel
          </Button>
          <Button
            variant="filled"
            onClick={form.handleSubmit(handleSave)}
            disabled={!form.formState.isValid || isLoading}
            sx={{ flex: 1 }}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
