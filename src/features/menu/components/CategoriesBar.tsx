import { Box, Container } from "@mui/material";
import { useEffect, useState } from "react";
import CategoryChip from "./CategoryChip";
import { ICategory } from "../../../data/Sides";
import { Colors } from "../../../theme";
import { categories as categoriesData } from "../../../data/categories";
import { getCategories } from "../../../services/category.service";

interface categoryProps {
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
}

export const CategoriesBar = ({
  selectedCategoryId,
  setSelectedCategoryId,
}: categoryProps) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (!data || data.length === 0) {
          setError("No categories found.");
          setCategories([]);
        } else {
          setCategories(data);
          setSelectedCategoryId(data[0]?.id || null);
          categoriesData.length = 0;
          categoriesData.push(
            ...data.map((category) => ({
              id: category.id,
              name: category.name,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching categories", error);
        setError("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

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
    return <div>{error}</div>;
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
