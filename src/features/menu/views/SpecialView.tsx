import { Box, Container, Typography } from "@mui/material";
import SpecialCard from "../components/SpecialCard";
import { ICategory, IDish } from "../../../data/Sides";
import { useEffect, useMemo } from "react";

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

  useEffect(() => {
    onLoadingChange?.(false);
  }, [onLoadingChange]);

  if (specialItems.length === 0) {
    return null;
  }

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          overflowY: "hidden",
          overflowX: "scroll",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {specialItems.map((item) => (
          <SpecialCard data={item} key={item.id ?? item._id} />
        ))}
      </Box>
    </Container>
  );
};

export default SpecialView;
