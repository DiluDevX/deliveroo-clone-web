import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useMemo, useState } from "react";
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
  const [isSearching, setIsSearching] = useState(false);

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
  const hasSearchTerm = Boolean(searchTerm.trim());

  const closeSearch = () => {
    setIsOpen(false);
    setSearchTerm("");
    setIsSearching(false);
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      return undefined;
    }

    setIsSearching(true);
    const timeoutId = window.setTimeout(() => {
      setIsSearching(false);
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const searchContainerSx = {
    position: "fixed",
    top: { xs: 10, md: 14 },
    left: "50%",
    transform: "translateX(-50%)",
    width: { xs: "calc(100vw - 24px)", md: 760, lg: 760 },
    maxWidth: { xs: "calc(100vw - 24px)", md: "calc(100vw - 48px)" },
  } as const;

  const searchInputSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: Colors.background.light,
      borderRadius: "999px",
      boxShadow: `0 1px 4px ${Colors.boxShadow.default}`,
      "& fieldset": {
        border: "none",
      },
      "&:hover fieldset": {
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: "none",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiInputBase-input": {
      py: 1.25,
    },
  } as const;

  return (
    <>
      <Box
        sx={{
          ...searchContainerSx,
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
            ...searchInputSx,
          }}
        />
      </Box>

      <IconButton
        aria-label={`Search ${restaurantName}`}
        onClick={() => setIsOpen(true)}
        sx={{
          position: "fixed",
          top: 17,
          right: 112,
          zIndex: 130,
          display: { xs: isOpen ? "none" : "flex", md: "none" },
          width: 42,
          height: 42,
          borderRadius: "6px",
          color: Colors.background.brand,
          backgroundColor: Colors.background.light,
          border: `1px solid ${Colors.border.subtle}`,
          "&:hover": {
            backgroundColor: Colors.background.default,
          },
        }}
      >
        <SearchOutlinedIcon />
      </IconButton>

      {isOpen && (
        <Box
          role="presentation"
          onMouseDown={closeSearch}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1200,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            display: "block",
          }}
        >
          <Box
            role="dialog"
            aria-modal="true"
            aria-label={`Search ${restaurantName}`}
            onMouseDown={(event) => event.stopPropagation()}
            sx={{
              ...searchContainerSx,
              boxSizing: "border-box",
              maxHeight: {
                xs: "calc(100dvh - 20px)",
                md: "calc(100dvh - 42px)",
              },
              overflow: "hidden",
              backgroundColor: Colors.background.light,
              border: hasSearchTerm
                ? `2px solid ${Colors.border.dark}`
                : "none",
              borderRadius: hasSearchTerm ? "18px" : "999px",
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
                  ...searchInputSx,
                }}
              />
            </Box>

            {hasSearchTerm && (
              <Box sx={{ px: 2, py: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                  {results.length} results for "{searchTerm.trim()}"
                </Typography>

                {isSearching ? (
                  <Box
                    sx={{
                      minHeight: 220,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress
                      size={34}
                      thickness={4}
                      aria-label="Searching menu"
                      sx={{ color: Colors.background.brand }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        sm: "repeat(3, minmax(0, 1fr))",
                        md: "repeat(5, minmax(0, 1fr))",
                        lg: "repeat(5, minmax(0, 1fr))",
                      },
                      gap: 1.5,
                      maxHeight: "calc(100dvh - 150px)",
                      overflowY: "auto",
                      pb: 1,
                      pr: 0.5,
                    }}
                  >
                    {results.map((dish) => (
                      <SpecialCard
                        key={dish._id}
                        data={dish}
                        fillContainer
                        compact
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default RestaurantMenuSearch;
