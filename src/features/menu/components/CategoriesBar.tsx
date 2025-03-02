import { Box, Container, Typography } from "@mui/material";
import CategoryChip from "./CategoryChip";
import { ICategory } from "../../../data/Sides";
import { Colors } from "../../../theme";

interface CategoryProps {
  error: string | null;
  categories: ICategory[];
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
}

export const CategoriesBar = ({
  error,
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
}: CategoryProps) => {
  const handleOnCategoryClick = (id: number) => {
    setSelectedCategoryId(id);
    const section = document.getElementById(`categoryId-${id}`);
    if (section) {
      const offset = 150;
      const top = section.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (error) {
    return (
      <Typography sx={{ display: "flex", justifyContent: "center" }}>
        {error}
      </Typography>
    );
  }

  if (!categories.length) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        borderTopWidth: 1,
        borderStyle: "solid",
        borderColor: Colors.border.default,
        position: "sticky",
        height: "70px",
        alignItems: "center",
        display: "flex",
        top: "68px",
        zIndex: "1000",
        backgroundColor: Colors.background.light,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          ml: { xs: 0, sm: 0, md: 0, lg: 0, xl: "57px" },
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {categories.map((category) => (
          <CategoryChip
            key={category.id}
            data={category}
            onClick={() => handleOnCategoryClick(category.id)}
            selected={selectedCategoryId === category.id}
          />
        ))}
      </Container>
    </Box>
  );
};

export default CategoriesBar;
