import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo, useState } from "react";
import { ICategory } from "../../../data/Sides";
import { Colors } from "../../../theme";
import SpecialCard from "./SpecialCard";

type RestaurantMenuSearchProps = {
  categories: ICategory[];
  restaurantName: string;
};

const RestaurantMenuSearch = ({
  categories,
  restaurantName,
}: RestaurantMenuSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dishes = useMemo(
    () => categories.flatMap((category) => category.dishes ?? []),
    [categories],
  );

  const results = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return [];
    }

    return dishes.filter((dish) =>
      [dish.name, dish.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearchTerm)),
    );
  }, [dishes, searchTerm]);

  const closeSearch = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          width: { md: 720, lg: 860 },
          maxWidth: "calc(100vw - 48px)",
          zIndex: 130,
          display: { xs: "none", md: isOpen ? "none" : "block" },
        }}
      >
        <TextField
          fullWidth
          size="small"
          value=""
          onFocus={() => setIsOpen(true)}
          placeholder={`Search ${restaurantName}`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ color: Colors.text.placeholder }} />
              </InputAdornment>
            ),
            readOnly: true,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: Colors.background.light,
              borderRadius: "999px",
              boxShadow: `0 1px 4px ${Colors.boxShadow.default}`,
            },
          }}
        />
      </Box>

      {isOpen && (
        <Box
          role="presentation"
          onMouseDown={closeSearch}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1200,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            role="dialog"
            aria-modal="true"
            aria-label={`Search ${restaurantName}`}
            onMouseDown={(event) => event.stopPropagation()}
            sx={{
              position: "fixed",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              width: { md: 720, lg: 860 },
              maxWidth: "calc(100vw - 48px)",
              maxHeight: "calc(100dvh - 42px)",
              overflow: "hidden",
              backgroundColor: Colors.background.light,
              border: `2px solid ${Colors.border.dark}`,
              borderRadius: "18px",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.28)",
            }}
          >
            <Box>
              <TextField
                autoFocus
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={`Search ${restaurantName}`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon
                        sx={{ color: Colors.text.placeholder }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Close search"
                        onClick={closeSearch}
                      >
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "999px",
                    backgroundColor: Colors.background.light,
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                    },
                  },
                  "& .MuiInputBase-input": {
                    py: 1.25,
                  },
                }}
              />
            </Box>

            <Box sx={{ px: 2, py: 1.5 }}>
              {searchTerm.trim() && (
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                  {results.length} results for "{searchTerm.trim()}"
                </Typography>
              )}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    md: "repeat(4, minmax(0, 1fr))",
                    lg: "repeat(5, minmax(0, 1fr))",
                  },
                  gap: 2,
                  maxHeight: "calc(100dvh - 150px)",
                  overflowY: "auto",
                  pb: 1,
                }}
              >
                {results.map((dish) => (
                  <SpecialCard key={dish._id} data={dish} />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default RestaurantMenuSearch;
