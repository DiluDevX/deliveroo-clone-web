import {
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { Link, useNavigate } from "react-router-dom";
import { Colors } from "../../../theme";
import { useState } from "react";

const MainViewSearchBox = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSearchInput = () => {
    if (searchInput.trim() !== "") {
      navigate(
        `/filtered-restaurants?search=${encodeURIComponent(searchInput)}`,
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        zIndex: 1,
      }}
    >
      <Typography
        sx={{
          fontWeight: "bolder",
          mt: "2rem",
          fontSize: { xs: "1.8rem", sm: "2.5rem", md: "2.4rem" },
          lineHeight: 1.2,
          textAlign: { sx: "left", md: "left", lg: "center" },
          textWrap: "none",
          whiteSpace: "pre",
          textOverflow: "ellipsis",
          color: Colors.text.default,
          width: "100%",
        }}
      >
        Restaurants, takeaways,
        <br /> supermarkets and <br /> shops. Delivered.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          marginTop: "30px",
          width: "100%",
          maxWidth: "900px",
          alignContent: "center",
          justifyContent: "center",
          padding: "3rem 2rem",
          borderRadius: "4px",
          color: Colors.text.default,
          boxShadow: `0px 4px 10px ${Colors.boxShadow.default}`,
        }}
      >
        <Typography sx={{ fontSize: "13px", paddingBottom: "1rem" }}>
          Enter a restaurant name to see what we deliver:
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Restaurants"
          value={searchInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchInput();
            }
          }}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: `1px solid ${Colors.border.subtleLight}`,
                boxShadow: `0px 2px 8px ${Colors.boxShadow.default}`,
              },
              "&.Mui-focused fieldset": {
                borderColor: Colors.border.dark,
              },
              "&:hover fieldset": {
                border: `1px solid ${Colors.border.subtleLight}`,
              },
              borderRadius: "25px",
              caretColor: Colors.background.brand,

              fontSize: { xs: "1rem", sm: "2.5rem", md: "1rem" },
              height: "50px",
              textAlign: "center",
            },
            "& .MuiInputBase-input": {
              borderColor: Colors.border.default,
              alignItems: "center",
              marginBottom: { xs: "0", sm: "0.1rem" },
              "&::placeholder": {
                fontSize: { xs: "0.75rem", sm: "1rem" },
                opacity: 0.4,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  sx={{
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <NearMeOutlinedIcon sx={{ color: Colors.background.brand }} />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" sx={{ marginRight: "-10px" }}>
                <IconButton
                  onClick={handleSearchInput}
                  sx={{
                    backgroundColor: Colors.background.brand,
                    borderRadius: "25px",
                    padding: "0.5rem 1rem",
                    "&:hover": {
                      backgroundColor: Colors.background.brandHover,
                    },
                  }}
                >
                  <Typography
                    sx={{ color: Colors.text.inverse, fontWeight: "bold" }}
                  >
                    Search
                  </Typography>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography
          sx={{
            fontSize: "12px",
            marginTop: "1rem",
            display: token ? "none" : "flex",
          }}
        >
          <Link
            to={"/SignPage/login"}
            style={{
              color: Colors.background.brand,
              textDecoration: "none",
              paddingRight: "5px",
            }}
          >
            Log in
          </Link>
          for your recent addresses.
        </Typography>
      </Box>
    </Box>
  );
};

export default MainViewSearchBox;
