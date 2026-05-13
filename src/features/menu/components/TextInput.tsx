import { TextField, Typography, TextFieldProps, Box } from "@mui/material";
import { Colors } from "../../../theme";
import { forwardRef } from "react"; // Import React and forwardRef

type TextInputProps = Omit<TextFieldProps, "error"> & {
  error?: string;
  value?: string;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, label, required, ...props }: TextInputProps, ref) => {
    return (
      <Box sx={{ marginBottom: "1rem" }}>
        <TextField
          {...props}
          error={!!error}
          ref={ref}
          label={label}
          required={required}
          sx={{
            fontSize: "1rem",
            marginTop: "0.5rem",
            outlineColor: Colors.text.default,
            borderRadius: "3px",
            boxShadow: `inset 0 1px 3px ${Colors.boxShadow.default}, inset 0 0 0 100px #fff`,
            "& .MuiInputLabel-root.Mui-focused": {
              color: Colors.background.brand,
            },
            "& .MuiInputLabel-root.Mui-error.Mui-focused": {
              color: Colors.error.main,
            },
            "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
              {
                borderColor: Colors.error.main,
              },
            "& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: Colors.error.main,
              },
            ...props.sx,
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
