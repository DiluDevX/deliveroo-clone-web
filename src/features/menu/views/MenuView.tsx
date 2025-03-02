import { Box } from "@mui/material";
import SpecialView from "./SpecialView";
import PopularView from "./PopularView";
import DishView from "./DishView";
import { ICategory } from "../../../data/Sides";

const MenuView = ({ categories }: { categories: ICategory[] }) => {
  return (
    <Box>
      <SpecialView />
      <PopularView />
      <DishView categories={categories} />
    </Box>
  );
};

export default MenuView;
