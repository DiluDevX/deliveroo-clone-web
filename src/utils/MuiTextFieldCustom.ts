import { Colors } from "../theme";

export const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: Colors.background.brand,
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: Colors.background.brand,
    },
  },
};
