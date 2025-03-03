import React, { useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Box, InputAdornment, OutlinedInput } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Colors } from "../../../theme/colors";

const SearchBar = () => {
  const [searchKey, setSearchKey] = useState("");

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchKey(e.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        mx: 1,
        alignItems: "center",
        width: "100%",
        maxWidth: "600px",
      }}
    >
      <OutlinedInput
        fullWidth
        value={searchKey}
        onChange={handleOnChange}
        id="outlined-basic"
        placeholder={`Search ${localStorage.getItem("restaurantName")}`}
        sx={{
          height: 43,
          display: {
            xs: "none",
            sm: "flex",
            md: "flex",
          },
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
              <CloseIcon onClick={() => setSearchKey("")} />
            </InputAdornment>
          ) : undefined
        }
      />
    </Box>
  );
};

export default SearchBar;
