import React, { useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Box, InputAdornment, OutlinedInput } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Colors } from "../../../theme/colors";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  value: externalValue,
  onChange,
  onClear,
  onSearch,
  placeholder,
}: SearchBarProps) => {
  const [internalValue, setInternalValue] = useState("");
  const searchKey = externalValue ?? internalValue;
  const defaultPlaceholder = `Search ${
    localStorage.getItem("restaurantName") ?? "restaurants"
  }`;

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newValue = e.target.value;
    if (externalValue === undefined) {
      setInternalValue(newValue);
    }

    if (onChange) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSearch && searchKey.trim()) {
      onSearch(searchKey.trim());
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        maxWidth: "600px",
      }}
    >
      <OutlinedInput
        fullWidth
        size="small"
        value={searchKey}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        id="outlined-basic"
        placeholder={placeholder ?? defaultPlaceholder}
        sx={{
          height: 43,
          flex: 1,
          minWidth: 100,
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          border: `0.5px solid ${Colors.border.subtle}`,
        }}
        startAdornment={
          <InputAdornment position="start">
            <SearchOutlinedIcon />
          </InputAdornment>
        }
        endAdornment={
          searchKey.length > 0 ? (
            <InputAdornment position="start">
              <CloseIcon
                onClick={() => {
                  if (externalValue === undefined) {
                    setInternalValue("");
                  }

                  if (onChange) {
                    onChange("");
                  }

                  if (onClear) {
                    onClear();
                  }
                }}
                sx={{ cursor: "pointer" }}
              />
            </InputAdornment>
          ) : undefined
        }
      />
    </Box>
  );
};

export default SearchBar;
