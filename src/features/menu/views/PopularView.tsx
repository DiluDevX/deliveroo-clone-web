import { Box, Container, Typography } from "@mui/material";
import SpecialCard from "../components/SpecialCard";
import { ICategory, IDish } from "../../../data/Sides";
import { useEffect, useMemo } from "react";

interface PopularViewProps {
  categories: ICategory[];
  onLoadingChange?: (isLoading: boolean) => void;
}

const getPopularItems = (categories: ICategory[]): IDish[] =>
  categories
    .flatMap((category) => category.dishes ?? [])
    .filter((dish) => dish.isPopular === true);

const PopularView = ({ categories, onLoadingChange }: PopularViewProps) => {
  const popularItems = useMemo(() => getPopularItems(categories), [categories]);

  useEffect(() => {
    onLoadingChange?.(false);
  }, [onLoadingChange]);

  if (popularItems.length === 0) {
    return null;
  }

  return (
    <Container
      disableGutters
      sx={{ height: "380px", marginBottom: "1rem", marginTop: "1rem" }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          marginBottom: "0.7rem",
        }}
        variant="h6"
      >
        Popular with other people
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          overflow: "scroll",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {popularItems.map((item) => (
          <SpecialCard data={item} key={item.id ?? item._id} />
        ))}
      </Box>
    </Container>
  );
};

export default PopularView;
