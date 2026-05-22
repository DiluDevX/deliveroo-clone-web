import { Box, Grid2 as Grid, Typography } from "@mui/material";
import { Colors } from "../../../theme/colors";
import Dish from "../components/Dish";
import { useEffect, useState, useMemo } from "react";
import { ICategory, IDish } from "../../../data/Sides";

interface DishViewProps {
  categories: ICategory[];
  onLoadingChange?: (isLoading: boolean) => void;
}

const DishView = ({ categories = [], onLoadingChange }: DishViewProps) => {
  const [dishesByCategory, setDishesByCategory] = useState<{
    [key: string]: IDish[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const categoryIds = useMemo(
    () => categories.map((category) => category.id),
    [categories],
  );

  // Filter categories that have dishes
  const categoriesWithDishes = useMemo(
    () =>
      categories.filter(
        (category) =>
          dishesByCategory[category.id] &&
          dishesByCategory[category.id].length > 0,
      ),
    [categories, dishesByCategory],
  );

  // Notify parent when loading state changes
  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  useEffect(() => {
    setDishesByCategory(
      categories.reduce<Record<string, IDish[]>>((acc, category) => {
        acc[category.id] = category.dishes ?? [];
        return acc;
      }, {}),
    );
    setIsLoading(false);
  }, [categories, categoryIds]);

  // Don't render anything - parent handles loading state
  if (!categories.length) {
    return (
      <Typography sx={{ color: Colors.text.default }}>
        No categories available
      </Typography>
    );
  }

  // Show message if no categories have dishes
  if (!isLoading && categoriesWithDishes.length === 0) {
    return (
      <Typography sx={{ color: Colors.text.default }}>
        No dishes available
      </Typography>
    );
  }

  return (
    <Box>
      {categoriesWithDishes.map((category) => {
        return (
          <Box
            key={category.id}
            sx={{ marginBottom: "2rem" }}
            id={`categoryId-${category.id}`}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "1.3rem",
                marginTop: "1.5rem",
                marginBottom: "1rem",
                color: Colors.text.default,
              }}
            >
              {category.name}
            </Typography>
            <Grid container spacing={{ sm: 0, md: 2, lg: 2 }}>
              {dishesByCategory[category.id].map((dish) => {
                return (
                  <Grid
                    sx={{ marginBottom: "1rem" }}
                    key={dish._id}
                    size={{ xs: 12, sm: 12, md: 6, lg: 6 }}
                  >
                    <Dish data={dish} />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

export default DishView;
