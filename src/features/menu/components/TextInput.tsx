import { TextField, Typography, TextFieldProps, Box } from "@mui/material";
import { Colors } from "../../../theme";
import { forwardRef } from "react"; // Import React and forwardRef

type TextInputProps = Omit<TextFieldProps, "error"> & {
  error?: string;
  value?: string;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, label, ...props }: TextInputProps, ref) => {
    return (
      <Box sx={{ marginBottom: "1rem" }}>
        <Typography sx={{ fontWeight: "normal", color: Colors.text.default }}>
          {label}
        </Typography>
        <TextField
          {...props}
          error={!!error}
          ref={ref}
          sx={{
            fontSize: "1rem",
            marginTop: "0.5rem",
            outlineColor: Colors.text.default,
            borderRadius: "3px",
            boxShadow: `inset 0 1px 3px ${Colors.boxShadow.default}, inset 0 0 0 100px #fff`,
          }}
        />
        {error && (
          <Typography variant="caption" color="error" sx={{ mb: 1.5 }}>
            {error}
          </Typography>
        )}
      </Box>
    );
  },
);

export default TextInput;
