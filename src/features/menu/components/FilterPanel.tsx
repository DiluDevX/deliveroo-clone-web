import {
  Box,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Colors } from "../../../theme/colors";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  FilterState,
  CUISINE_OPTIONS,
  PRICE_OPTIONS,
  RATING_OPTIONS,
} from "../../../types/filters";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

const FilterPanel = ({
  filters,
  onFilterChange,
  onClose,
  isOpen = true,
}: FilterPanelProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleCuisineChange = (cuisineId: string) => {
    onFilterChange({
      ...filters,
      cuisines: filters.cuisines.includes(cuisineId) ? [] : [cuisineId],
    });
  };

  const handlePriceChange = (price: string) => {
    onFilterChange({
      ...filters,
      priceRange: price as "all" | "budget" | "mid" | "premium",
    });
  };

  const handleRatingChange = (rating: number | null) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? null : rating,
    });
  };

  const handleOffersChange = () => {
    onFilterChange({
      ...filters,
      offers: !filters.offers,
    });
  };

  const panelContent = (
    <Box
      sx={{
        p: 3,
        pt: 0,
        width: { xs: "100%", md: 300 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxHeight: isMobile ? "85vh" : "none",
        overflowY: isMobile ? "auto" : "visible",
        overscrollBehavior: "contain",
      }}
    >
      {/* Close button for mobile */}
      {isMobile && onClose && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <IconButton
            onClick={onClose}
            sx={{
              color: Colors.background.brand,
              p: 0.5,
            }}
          >
            <KeyboardArrowDownIcon sx={{ fontSize: "32px" }} />
          </IconButton>
        </Box>
      )}

      <Box sx={{ mt: 0 }}>
        <Typography
          sx={{
            fontWeight: 700,
            mb: 2,
            color: Colors.text.default,
            fontSize: "0.95rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Cuisines
        </Typography>
        <RadioGroup value={filters.cuisines[0] ?? ""} sx={{ gap: 0.5 }}>
          {CUISINE_OPTIONS.map((cuisine) => (
            <FormControlLabel
              key={cuisine.id}
              value={cuisine.id}
              control={
                <Radio
                  checked={filters.cuisines.includes(cuisine.id)}
                  onChange={() => handleCuisineChange(cuisine.id)}
                  size="small"
                  sx={{
                    color: Colors.border.subtle,
                    "&.Mui-checked": {
                      color: Colors.background.brand,
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{ fontSize: "0.9rem", color: Colors.text.default }}
                >
                  {cuisine.label}
                </Typography>
              }
              sx={{ gap: 1, m: 0 }}
            />
          ))}
        </RadioGroup>
      </Box>

      <Box sx={{ borderTop: `1px solid ${Colors.border.subtle}`, pt: 2 }}>
        <Typography
          sx={{
            fontWeight: 700,
            mb: 2,
            color: Colors.text.default,
            fontSize: "0.95rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Price
        </Typography>
        <RadioGroup
          value={filters.priceRange}
          onChange={(e) => handlePriceChange(e.target.value)}
          sx={{ gap: 0.5 }}
        >
          {PRICE_OPTIONS.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  size="small"
                  sx={{
                    color: Colors.border.subtle,
                    "&.Mui-checked": {
                      color: Colors.background.brand,
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{ fontSize: "0.9rem", color: Colors.text.default }}
                >
                  {option.label}
                </Typography>
              }
              sx={{ gap: 1, m: 0 }}
            />
          ))}
        </RadioGroup>
      </Box>

      <Box sx={{ borderTop: `1px solid ${Colors.border.subtle}`, pt: 2 }}>
        <Typography
          sx={{
            fontWeight: 700,
            mb: 2,
            color: Colors.text.default,
            fontSize: "0.95rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Rating
        </Typography>
        <RadioGroup
          value={filters.minRating ?? ""}
          onChange={(e) => handleRatingChange(Number(e.target.value))}
          sx={{ gap: 0.5 }}
        >
          {RATING_OPTIONS.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  checked={filters.minRating === option.value}
                  size="small"
                  sx={{
                    color: Colors.border.subtle,
                    "&.Mui-checked": {
                      color: Colors.background.brand,
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{ fontSize: "0.9rem", color: Colors.text.default }}
                >
                  {option.label}
                </Typography>
              }
              sx={{ gap: 1, m: 0 }}
            />
          ))}
        </RadioGroup>
      </Box>

      <Box sx={{ borderTop: `1px solid ${Colors.border.subtle}`, pt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.offers}
              onChange={handleOffersChange}
              sx={{
                color: Colors.border.subtle,
                "&.Mui-checked": {
                  color: Colors.background.brand,
                },
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: Colors.text.default,
              }}
            >
              Offers Only
            </Typography>
          }
          sx={{ gap: 1, m: 0 }}
        />
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "85vh",
            backgroundColor: Colors.background.light,
          },
        }}
      >
        {panelContent}
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: 300,
        borderRight: `1px solid ${Colors.border.subtle}`,
        backgroundColor: Colors.background.light,
        height: "calc(100vh - 100px)",
        position: "sticky",
        top: 100,
        overflowY: "auto",
        overscrollBehavior: "contain",
      }}
    >
      {panelContent}
    </Box>
  );
};

export default FilterPanel;
