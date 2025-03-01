import { Box } from "@mui/material";
import SpecialView from "./SpecialView";
import PopularView from "./PopularView";
import DishView from "./DishView";

const MenuView = () => {
  return (
    <Box>
      <SpecialView />
      <PopularView />
      <DishView />
    </Box>
  );
};

export default MenuView;
