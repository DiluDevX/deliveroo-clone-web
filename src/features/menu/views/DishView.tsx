import { Box, Grid2 as Grid, Typography } from "@mui/material";
import { Colors } from "../../../theme/colors";
import Dish from "../components/Dish";
import { useEffect, useState, useMemo } from "react";
import { ICategory, IDish } from "../../../data/Sides";
import { getDishes } from "../../../services/dish.service";
import LoadingIndicator from "../components/LoadingIndicator";

const DishView = ({ categories = [] }: { categories: ICategory[] }) => {
  const [dishesByCategory, setDishesByCategory] = useState<{
    [key: string]: IDish[];
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const categoryIds = useMemo(
    () => categories.map((category) => category.id),
    [categories],
  );

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchDishes = async (categoryId: string) => {
      try {
        const response: IDish[] = await delay(2000).then(() =>
          getDishes(categoryId),
        );
        setDishesByCategory({ [categoryId]: response });
      } catch (error) {
        console.error(
          `Error fetching dishes for category ${categoryId}:`,
          error,
        );
      }
    };

    const fetchAllDishes = async () => {
      if (categoryIds.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      await Promise.all(
        categoryIds.map((categoryId) => fetchDishes(categoryId.toString())),
      );
      setIsLoading(false);
    };

    fetchAllDishes();
  }, [categoryIds]);

  if (!categories.length || isLoading) {
    return (
      <Box>
        <Typography sx={{ color: Colors.text.default }}>
          {categories.length === 0 ? (
            "No categories available"
          ) : (
            <Box
              sx={{
                mb: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LoadingIndicator />
            </Box>
          )}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {categories.map((category) => (
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
          <Grid
            container
            spacing={{
              sm: 0,
              md: 2,
              lg: 2,
            }}
          >
            {dishesByCategory[category.id]?.length > 0 ? (
              dishesByCategory[category.id].map((dish) => (
                <Grid
                  sx={{ marginBottom: "1rem" }}
                  key={dish.id}
                  size={{
                    xs: 12,
                    sm: 12,
                    md: 6,
                    lg: 6,
                  }}
                >
                  <Dish data={dish} key={dish.id} />
                </Grid>
              ))
            ) : (
              <Typography
                sx={{
                  color: Colors.text.default,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                No dishes available
              </Typography>
            )}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default DishView;
