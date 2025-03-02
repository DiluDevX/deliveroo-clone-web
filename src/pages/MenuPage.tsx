import { Box, Container, Grid2 as Grid } from "@mui/material";
import RestaurantInfoView from "../features/menu/views/RestaurantInfoView";
import CategoriesBar from "../features/menu/components/CategoriesBar";
import MenuView from "../features/menu/views/MenuView";
import Cart from "../features/menu/components/Cart";
import { Colors } from "../theme";
import { useState } from "react";

const MenuPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  return (
    <Box sx={{ flexGrow: 1, width: "100%", mt: 7 }}>
      <RestaurantInfoView />
      <CategoriesBar
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          backgroundColor: Colors.background.default,
          minHeight: "calc(100vh - 130px)",
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid
              size={{
                sm: 12,
                xs: 12,
                md: 8,
              }}
            >
              <MenuView />
            </Grid>
            <Grid
              sx={{
                display: {
                  xs: "none",
                  sm: "none",
                  md: "block",
                },
              }}
              size={{
                sm: 0,
                md: 4,
              }}
            >
              <Cart />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default MenuPage;
