import {
  Box,
  Dialog,
  DialogContent,
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
          width: { md: 420, lg: 560 },
          zIndex: 130,
          display: { xs: "none", md: "block" },
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

      <Dialog
        open={isOpen}
        onClose={closeSearch}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "18px",
            maxHeight: "calc(100dvh - 48px)",
          },
        }}
      >
        <DialogContent sx={{ p: 2 }}>
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
                  <SearchOutlinedIcon sx={{ color: Colors.text.placeholder }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="Close search" onClick={closeSearch}>
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
              },
            }}
          />

          {searchTerm.trim() && (
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
              {results.length} results for "{searchTerm.trim()}"
            </Typography>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
                md: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
              maxHeight: "70dvh",
              overflowY: "auto",
              pb: 1,
            }}
          >
            {results.map((dish) => (
              <SpecialCard key={dish._id} data={dish} />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RestaurantMenuSearch;
