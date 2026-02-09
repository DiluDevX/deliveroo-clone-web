import {
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { Link, useNavigate } from "@tanstack/react-router";
import { Colors } from "../../../theme";
import { useState } from "react";
import { useAppSelector } from "../../../store/hooks/cartHooks";

const MainViewSearchBox = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleSearchInput = () => {
    if (searchInput.trim() !== "") {
      navigate({
        to: `/filtered-restaurants?search=${encodeURIComponent(searchInput)}`,
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        zIndex: 1,
        textAlign: { xs: "left", sm: "left", md: "left", lg: "center" },
      }}
    >
      <Typography
        sx={{
          fontWeight: "bolder",
          mt: "2rem",
          fontSize: { xs: "1.8rem", sm: "2rem", md: "2.5rem", lg: "2.5rem" },
          lineHeight: 1.2,
          textAlign: { xs: "left", sm: "left", md: "left", lg: "center" },
          color: Colors.text.default,
          maxWidth: "100%",
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
          padding: "2.5rem",
          borderRadius: "8px",
          color: Colors.text.default,
          boxShadow: `0px 4px 10px ${Colors.boxShadow.default}`,
        }}
      >
        <Typography sx={{ fontSize: "14px", pb: "1rem", textAlign: "left" }}>
          Enter a restaurant name to see what we deliver:
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Restaurants..."
          value={searchInput}
          onKeyDown={(e) => e.key === "Enter" && handleSearchInput()}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: `1px solid ${Colors.border.subtleLight}`,
                boxShadow: `0px 2px 8px ${Colors.boxShadow.default}`,
              },
              "&.Mui-focused fieldset": {
                borderColor: Colors.border.subtleLight,
                outline: "none",
              },
              "&:hover fieldset": {
                border: `1px solid ${Colors.border.subtleLight}`,
              },
              borderRadius: "26px",
              caretColor: Colors.background.brand,
              fontSize: { xs: "1rem", sm: "1.2rem" },
              height: "55px",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiInputBase-input": {
              "&::placeholder": {
                fontSize: "1rem",
                opacity: 0.5,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  sx={{
                    "&:hover": { backgroundColor: "transparent" },
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
                    borderRadius: "24px",
                    padding: "0.7rem 2rem",
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

        {!user && !isAuthenticated && (
          <Typography
            sx={{
              fontSize: "13px",
              marginTop: "1rem",
              textAlign: "left",
            }}
          >
            <Link
              to={"/account"}
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
        )}
      </Box>
    </Box>
  );
};

export default MainViewSearchBox;
