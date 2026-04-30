import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
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
  DELIVERY_TIME_OPTIONS,
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
    const newCuisines = filters.cuisines.includes(cuisineId)
      ? filters.cuisines.filter((c) => c !== cuisineId)
      : [...filters.cuisines, cuisineId];

    onFilterChange({ ...filters, cuisines: newCuisines });
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

  const handleDeliveryTimeChange = (time: number | null) => {
    onFilterChange({
      ...filters,
      deliveryTime: filters.deliveryTime === time ? null : time,
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
        maxHeight: "calc(100vh)",
        overflowY: "auto",
        overscrollBehavior: "contain",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none",
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
        <FormGroup sx={{ gap: 0.5 }}>
          {CUISINE_OPTIONS.map((cuisine) => (
            <FormControlLabel
              key={cuisine.id}
              control={
                <Checkbox
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
        </FormGroup>
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
        <FormGroup sx={{ gap: 0.5 }}>
          {RATING_OPTIONS.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={filters.minRating === option.value}
                  onChange={() => handleRatingChange(option.value)}
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
        </FormGroup>
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
          Delivery Time
        </Typography>
        <FormGroup sx={{ gap: 0.5 }}>
          {DELIVERY_TIME_OPTIONS.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={filters.deliveryTime === option.value}
                  onChange={() => handleDeliveryTimeChange(option.value)}
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
        </FormGroup>
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
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none",
      }}
    >
      {panelContent}
    </Box>
  );
};

export default FilterPanel;
