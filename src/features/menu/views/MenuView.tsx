import { Box } from "@mui/material";
import SpecialView from "./SpecialView";
import PopularView from "./PopularView";
import DishView from "./DishView";
import { ICategory } from "../../../data/Sides";
import { useState, useEffect, useCallback } from "react";
import LoadingIndicator from "../components/LoadingIndicator";

const MenuView = ({
  categories,
  onDishesLoadingChange,
}: {
  categories: ICategory[];
  onDishesLoadingChange: (isLoading: boolean) => void;
}) => {
  const [isDishesLoading, setIsDishesLoading] = useState(true);
  const [isPopularLoading, setIsPopularLoading] = useState(true);
  const [isSpecialLoading, setIsSpecialLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const handleDishesLoading = useCallback((isLoading: boolean) => {
    setIsDishesLoading(isLoading);
  }, []);

  const handlePopularLoading = useCallback((isLoading: boolean) => {
    setIsPopularLoading(isLoading);
  }, []);

  const handleSpecialLoading = useCallback((isLoading: boolean) => {
    setIsSpecialLoading(isLoading);
  }, []);

  const isAnyLoading = isDishesLoading || isPopularLoading || isSpecialLoading;

  // Notify parent and set ready state
  useEffect(() => {
    onDishesLoadingChange(isAnyLoading);
    if (!isAnyLoading && !isReady) {
      setIsReady(true);
    }
  }, [isAnyLoading, onDishesLoadingChange, isReady]);

  return (
    <Box>
      {!isReady && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <LoadingIndicator text="Loading menu..." />
        </Box>
      )}

      {/* Keep views mounted but completely hidden until ready */}
      <Box
        sx={{
          visibility: isReady ? "visible" : "hidden",
          height: isReady ? "auto" : 0,
          overflow: isReady ? "visible" : "hidden",
          opacity: isReady ? 1 : 0,
        }}
      >
        <SpecialView onLoadingChange={handleSpecialLoading} />
        <PopularView onLoadingChange={handlePopularLoading} />
        <DishView
          categories={categories}
          onLoadingChange={handleDishesLoading}
        />
      </Box>
    </Box>
  );
};

export default MenuView;
