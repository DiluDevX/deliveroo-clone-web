import { Box, Container, IconButton, Typography } from "@mui/material";
import SpecialCard from "../components/SpecialCard";
import { ICategory, IDish } from "../../../data/Sides";
import { useEffect, useMemo, useRef, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Colors } from "../../../theme";

interface SpecialViewProps {
  categories: ICategory[];
  onLoadingChange?: (isLoading: boolean) => void;
}

const SPECIAL_OFFERS_CATEGORY_ID = "special-offers";

const getSpecialItems = (categories: ICategory[]): IDish[] =>
  categories
    .flatMap((category) => category.dishes ?? [])
    .filter((dish) => Number(dish.discountPercent ?? 0) > 0);

const SpecialView = ({ categories, onLoadingChange }: SpecialViewProps) => {
  const specialItems = useMemo(() => getSpecialItems(categories), [categories]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showBackArrow, setShowBackArrow] = useState(false);

  useEffect(() => {
    onLoadingChange?.(false);
  }, [onLoadingChange]);

  if (specialItems.length === 0) {
    return null;
  }

  const scrollByDishPage = (direction: "back" | "forward") => {
    scrollRef.current?.scrollBy({
      left: direction === "forward" ? 560 : -560,
      behavior: "smooth",
    });

    if (direction === "forward") {
      setShowBackArrow(true);
    }
  };

  return (
    <Container
      disableGutters
      id={`categoryId-${SPECIAL_OFFERS_CATEGORY_ID}`}
      sx={{ mt: 2, mb: 2 }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
      >
        Special offers
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: "0.7rem" }}>
        Selected discounted dishes from this restaurant.
      </Typography>
      <Box sx={{ position: "relative" }}>
        {showBackArrow && (
          <IconButton
            aria-label="Previous special offers"
            onClick={() => scrollByDishPage("back")}
            sx={{
              display: { xs: "none", md: "flex" },
              position: "absolute",
              left: -22,
              top: "42%",
              zIndex: 3,
              width: 48,
              height: 48,
              backgroundColor: Colors.background.light,
              boxShadow: `0 3px 12px ${Colors.boxShadow.default}`,
              "&:hover": { backgroundColor: Colors.background.default },
            }}
          >
            <ArrowBackIcon sx={{ color: Colors.background.brand }} />
          </IconButton>
        )}
        <IconButton
          aria-label="Next special offers"
          onClick={() => scrollByDishPage("forward")}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "absolute",
            right: -22,
            top: "42%",
            zIndex: 3,
            width: 48,
            height: 48,
            backgroundColor: Colors.background.light,
            boxShadow: `0 3px 12px ${Colors.boxShadow.default}`,
            "&:hover": { backgroundColor: Colors.background.default },
          }}
        >
          <ArrowForwardIcon sx={{ color: Colors.background.brand }} />
        </IconButton>
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            alignItems: "center",
            overflowY: "hidden",
            overflowX: { xs: "scroll", md: "hidden" },
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {specialItems.map((item) => (
            <SpecialCard data={item} key={item.id ?? item._id} />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default SpecialView;
