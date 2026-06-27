import { Box, Grid2 as Grid, Skeleton } from "@mui/material";
import SpecialView from "./SpecialView";
import PopularView from "./PopularView";
import DishView from "./DishView";
import { ICategory } from "../../../data/Sides";
import { useState, useEffect, useCallback } from "react";
import LoadingIndicator from "../components/LoadingIndicator";

const MenuView = ({
  categories,
  isLoading = false,
  onDishesLoadingChange,
}: {
  categories: ICategory[];
  isLoading?: boolean;
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

  const isAnyLoading =
    isLoading || isDishesLoading || isPopularLoading || isSpecialLoading;

  // Notify parent and set ready state
  useEffect(() => {
    onDishesLoadingChange(isAnyLoading);
    if (!isAnyLoading && !isReady) {
      setIsReady(true);
    }
  }, [isAnyLoading, onDishesLoadingChange, isReady]);

  return (
    <Box>
      {isLoading && (
        <Box sx={{ pt: 3 }}>
          <Skeleton
            variant="rounded"
            height={110}
            sx={{ borderRadius: 2, mb: 4 }}
          />
          <Skeleton width={230} height={34} sx={{ mb: 1 }} />
          <Box
            sx={{
              display: "flex",
              gap: 2,
              overflow: "hidden",
              mb: 4,
            }}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                sx={{
                  width: { xs: 156, sm: 164, md: 170 },
                  height: { xs: 286, sm: 300, md: 310 },
                  flexShrink: 0,
                  borderRadius: 1,
                }}
              />
            ))}
          </Box>
          <Skeleton width={180} height={34} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, md: 6 }}>
                <Skeleton
                  variant="rounded"
                  height={178}
                  sx={{ borderRadius: 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {!isLoading && !isReady && (
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
          visibility: !isLoading && isReady ? "visible" : "hidden",
          height: !isLoading && isReady ? "auto" : 0,
          overflow: !isLoading && isReady ? "visible" : "hidden",
          opacity: !isLoading && isReady ? 1 : 0,
        }}
      >
        <SpecialView
          categories={categories}
          onLoadingChange={handleSpecialLoading}
        />
        <PopularView
          categories={categories}
          onLoadingChange={handlePopularLoading}
        />
        <DishView
          categories={categories}
          onLoadingChange={handleDishesLoading}
        />
      </Box>
    </Box>
  );
};

export default MenuView;
