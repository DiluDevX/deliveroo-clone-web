import { Box, Container, Typography } from "@mui/material";
import SpecialCard from "../components/SpecialCard";
import { specials } from "../../../data/Sides";
import { useEffect, useState } from "react";

interface SpecialViewProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

const SpecialView = ({ onLoadingChange }: SpecialViewProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or fetch data here
    const loadData = async () => {
      setIsLoading(true);
      // If you fetch data, do it here
      // For static data, just simulate a brief load
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Notify parent when loading state changes
  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  return (
    <Container disableGutters sx={{ mt: 2, mb: 2 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
      >
        20% off selected items
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: "0.7rem" }}>
        Spend £15.00, get 20% off selected items – T&Cs apply. New customers
        only.
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          overflowY: "hidden",
          overflowX: "scroll",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {specials.map((item) => (
          <SpecialCard data={item} key={item.id} />
        ))}
      </Box>
    </Container>
  );
};

export default SpecialView;
