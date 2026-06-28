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
  const [showForwardArrow, setShowForwardArrow] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [obscuredItemIndex, setObscuredItemIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    onLoadingChange?.(false);
  }, [onLoadingChange]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) {
      return;
    }

    const updateOverflow = () => {
      const maxScrollLeft =
        scrollElement.scrollWidth - scrollElement.clientWidth;
      const nextHasOverflow = maxScrollLeft > 1;
      const isAtEnd = scrollElement.scrollLeft >= maxScrollLeft - 8;
      const scrollRect = scrollElement.getBoundingClientRect();
      const nextObscuredIndex = Array.from(scrollElement.children).findIndex(
        (child) => {
          const childRect = child.getBoundingClientRect();
          return (
            childRect.left >= scrollRect.left - 1 &&
            childRect.right > scrollRect.right + 1
          );
        },
      );

      setHasOverflow(nextHasOverflow);
      setShowBackArrow(scrollElement.scrollLeft > 8);
      setShowForwardArrow(nextHasOverflow && !isAtEnd);
      setObscuredItemIndex(
        nextHasOverflow && !isAtEnd && nextObscuredIndex >= 0
          ? nextObscuredIndex
          : null,
      );
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
    const scrollElement = scrollRef.current;
    if (!scrollElement) {
      return;
    }

    const firstCard = scrollElement.children.item(0);
    const secondCard = scrollElement.children.item(1);
    const cardStep =
      firstCard && secondCard
        ? secondCard.getBoundingClientRect().left -
          firstCard.getBoundingClientRect().left
        : 186;
    const scrollAmount = cardStep * 3;
    const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth;
    const nextScrollLeft =
      direction === "forward"
        ? Math.min(scrollElement.scrollLeft + scrollAmount, maxScrollLeft)
        : Math.max(scrollElement.scrollLeft - scrollAmount, 0);

    scrollElement.scrollTo({
      left: nextScrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <Container
      disableGutters
      id={`categoryId-${POPULAR_CATEGORY_ID}`}
      sx={{ height: "336px", marginBottom: "1rem", marginTop: "1rem" }}
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
              top: "36%",
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
        {showForwardArrow && (
          <IconButton
            aria-label="Next popular dishes"
            onClick={() => scrollByDishPage("forward")}
            sx={{
              display: { xs: "none", md: "flex" },
              position: "absolute",
              right: 14,
              top: "36%",
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
          {popularItems.map((item, index) => (
            <SpecialCard
              data={item}
              isObscured={index === obscuredItemIndex}
              key={item.id ?? item._id}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default PopularView;
