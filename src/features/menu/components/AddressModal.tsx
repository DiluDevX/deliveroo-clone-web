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
import { Colors } from "../../../theme/colors";
import Button from "./Button";
import TextInput from "./TextInput";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Address } from "../../../types/user.types";

type AddressModalProps = {
  open: boolean;
  onClose: () => void;
  address?: Address | null;
  onSave: (address: AddressFormValues) => Promise<boolean>;
};

type AddressFormValues = {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  instructions?: string;
};

const AddressModal = ({
  open,
  onClose,
  address,
  onSave,
}: AddressModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const schema = z.object({
    label: z.string().min(1, "Label is required"),
    line1: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    postcode: z.string().min(1, "Postcode is required"),
    line2: z.string().optional(),
    instructions: z.string().optional(),
  });

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: address?.label || "",
      line1: address?.line1 || "",
      line2: address?.line2 || "",
      city: address?.city || "",
      postcode: address?.postcode || "",
      instructions: address?.instructions || "",
    },
  });

  useEffect(() => {
    form.reset({
      label: address?.label || "",
      line1: address?.line1 || "",
      line2: address?.line2 || "",
      city: address?.city || "",
      postcode: address?.postcode || "",
      instructions: address?.instructions || "",
    });
  }, [address, form]);

  const handleSave = async (values: AddressFormValues) => {
    setIsLoading(true);
    try {
      const success = await onSave(values);
      if (success) {
        onClose();
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
        <Typography sx={{ fontWeight: "bold" }}>
          {address ? "Edit Address" : "Add Address"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, m: 0, overflowY: "auto" }}>
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <Controller
            name="label"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                fullWidth
                label="Label (e.g. Home, Work)"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="line1"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                fullWidth
                label="Address Line 1"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="line2"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                fullWidth
                label="Address Line 2 (Optional)"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={fieldState.error?.message}
              />
            )}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Controller
              name="city"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  fullWidth
                  label="City"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="postcode"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  fullWidth
                  label="Postcode"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={fieldState.error?.message}
                />
              )}
            />
          </Box>

          <Controller
            name="instructions"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                fullWidth
                label="Delivery Instructions (Optional)"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={fieldState.error?.message}
                multiline
                rows={2}
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

export default AddressModal;
