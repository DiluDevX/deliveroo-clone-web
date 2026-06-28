import { Box, Container, IconButton, Typography } from "@mui/material";
import SpecialCard from "../components/SpecialCard";
import { ICategory, IDish } from "../../../data/Sides";
import { useEffect, useMemo, useRef, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Colors } from "../../../theme";

interface SpecialViewProps {
  categories: ICategory[];
  onLoadingChange?: (isLoading: boolean) => void;
}

const SPECIAL_OFFERS_CATEGORY_ID = "special-offers";

const getSpecialItems = (categories: ICategory[]): IDish[] =>
  categories
    .flatMap((category) => category.dishes ?? [])
    .filter((dish) => Number(dish.discountPercent ?? 0) > 0);

const SpecialView = ({ categories, onLoadingChange }: SpecialViewProps) => {
  const specialItems = useMemo(() => getSpecialItems(categories), [categories]);
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
  }, [specialItems.length]);

  if (specialItems.length === 0) {
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
      id={`categoryId-${SPECIAL_OFFERS_CATEGORY_ID}`}
      sx={{ mt: 2, mb: 2 }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
      >
        Special offers
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: "0.7rem" }}>
        Selected discounted dishes from this restaurant.
      </Typography>
      <Box
        sx={{
          position: "relative",
        }}
      >
        {hasOverflow && showBackArrow && (
          <IconButton
            aria-label="Previous special offers"
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
        {showForwardArrow && (
          <IconButton
            aria-label="Next special offers"
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
            alignItems: "center",
            overflowY: "hidden",
            overflowX: { xs: "scroll", md: "hidden" },
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {specialItems.map((item, index) => (
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

export default SpecialView;
