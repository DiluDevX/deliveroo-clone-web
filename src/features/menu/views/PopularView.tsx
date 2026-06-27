import { Box, Container, IconButton, Typography } from "@mui/material";
import SpecialCard from "../components/SpecialCard";
import { ICategory, IDish } from "../../../data/Sides";
import { useEffect, useMemo, useRef, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Colors } from "../../../theme";

interface PopularViewProps {
  categories: ICategory[];
  onLoadingChange?: (isLoading: boolean) => void;
}

const POPULAR_CATEGORY_ID = "popular";

const getPopularItems = (categories: ICategory[]): IDish[] =>
  categories
    .flatMap((category) => category.dishes ?? [])
    .filter((dish) => dish.isPopular === true);

const PopularView = ({ categories, onLoadingChange }: PopularViewProps) => {
  const popularItems = useMemo(() => getPopularItems(categories), [categories]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showBackArrow, setShowBackArrow] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    onLoadingChange?.(false);
  }, [onLoadingChange]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) {
      return;
    }

    const updateOverflow = () => {
      setHasOverflow(scrollElement.scrollWidth > scrollElement.clientWidth + 1);
      setShowBackArrow(scrollElement.scrollLeft > 8);
    };

    updateOverflow();
    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(scrollElement);
    scrollElement.addEventListener("scroll", updateOverflow, { passive: true });

    return () => {
      resizeObserver.disconnect();
      scrollElement.removeEventListener("scroll", updateOverflow);
    };
  }, [popularItems.length]);

  if (popularItems.length === 0) {
    return null;
  }

  const scrollByDishPage = (direction: "back" | "forward") => {
    scrollRef.current?.scrollBy({
      left: direction === "forward" ? 560 : -560,
      behavior: "smooth",
    });

    if (direction === "forward") {
      setShowBackArrow(true);
    }
  };

  return (
    <Container
      disableGutters
      id={`categoryId-${POPULAR_CATEGORY_ID}`}
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
          position: "relative",
          "&::before": {
            content: '""',
            display: hasOverflow && showBackArrow ? "block" : "none",
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: { xs: 32, md: 56 },
            zIndex: 2,
            pointerEvents: "none",
            background: `linear-gradient(90deg, ${Colors.background.default} 0%, rgba(241, 240, 240, 0) 100%)`,
          },
          "&::after": {
            content: '""',
            display: hasOverflow ? "block" : "none",
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: { xs: 32, md: 56 },
            zIndex: 2,
            pointerEvents: "none",
            background: `linear-gradient(270deg, ${Colors.background.default} 0%, rgba(241, 240, 240, 0) 100%)`,
          },
        }}
      >
        {hasOverflow && showBackArrow && (
          <IconButton
            aria-label="Previous popular dishes"
            onClick={() => scrollByDishPage("back")}
            sx={{
              display: { xs: "none", md: "flex" },
              position: "absolute",
              left: -22,
              top: "42%",
              zIndex: 3,
              width: 48,
              height: 48,
              backgroundColor: Colors.background.light,
              boxShadow: `0 3px 12px ${Colors.boxShadow.default}`,
              "&:hover": { backgroundColor: Colors.background.default },
            }}
          >
            <ArrowBackIcon sx={{ color: Colors.background.brand }} />
          </IconButton>
        )}
        {hasOverflow && (
          <IconButton
            aria-label="Next popular dishes"
            onClick={() => scrollByDishPage("forward")}
            sx={{
              display: { xs: "none", md: "flex" },
              position: "absolute",
              right: -22,
              top: "42%",
              zIndex: 3,
              width: 48,
              height: 48,
              backgroundColor: Colors.background.light,
              boxShadow: `0 3px 12px ${Colors.boxShadow.default}`,
              "&:hover": { backgroundColor: Colors.background.default },
            }}
          >
            <ArrowForwardIcon sx={{ color: Colors.background.brand }} />
          </IconButton>
        )}
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            overflowX: { xs: "scroll", md: "hidden" },
            overflowY: "hidden",
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {popularItems.map((item) => (
            <SpecialCard data={item} key={item.id ?? item._id} />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default PopularView;
