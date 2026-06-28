import { Box, Container, IconButton, Typography } from "@mui/material";
import SpecialCard from "../components/SpecialCard";
import { ICategory, IDish } from "../../../data/Sides";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const getCardStep = (scrollElement: HTMLDivElement) => {
  const firstCard = scrollElement.children.item(0);
  const secondCard = scrollElement.children.item(1);

  if (firstCard && secondCard) {
    return (
      secondCard.getBoundingClientRect().left -
      firstCard.getBoundingClientRect().left
    );
  }

  return firstCard ? firstCard.getBoundingClientRect().width : 186;
};

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

  const updateCarouselState = useCallback(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) {
      return;
    }

    const cardStep = getCardStep(scrollElement);
    const totalItems = scrollElement.children.length;
    const visibleFullCards = Math.max(
      1,
      Math.floor(scrollElement.clientWidth / cardStep),
    );
    const maxStartIndex = Math.max(0, totalItems - visibleFullCards);
    const currentStartIndex = Math.round(scrollElement.scrollLeft / cardStep);
    const nextHasOverflow = totalItems > visibleFullCards;
    const isAtEnd = currentStartIndex >= maxStartIndex;
    const scrollRect = scrollElement.getBoundingClientRect();
    const nextObscuredIndex = Array.from(scrollElement.children).findIndex(
      (child) => {
        const childRect = child.getBoundingClientRect();
        return (
          childRect.left < scrollRect.right - 1 &&
          childRect.right > scrollRect.right + 1
        );
      },
    );

    setHasOverflow(nextHasOverflow);
    setShowBackArrow(currentStartIndex > 0);
    setShowForwardArrow(nextHasOverflow && !isAtEnd);
    setObscuredItemIndex(
      nextHasOverflow && !isAtEnd && nextObscuredIndex >= 0
        ? nextObscuredIndex
        : null,
    );
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) {
      return;
    }

    updateCarouselState();
    const resizeObserver = new ResizeObserver(updateCarouselState);
    resizeObserver.observe(scrollElement);
    scrollElement.addEventListener("scroll", updateCarouselState, {
      passive: true,
    });

    return () => {
      resizeObserver.disconnect();
      scrollElement.removeEventListener("scroll", updateCarouselState);
    };
  }, [specialItems.length, updateCarouselState]);

  if (specialItems.length === 0) {
    return null;
  }

  const scrollByDishPage = (direction: "back" | "forward") => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) {
      return;
    }

    const cardStep = getCardStep(scrollElement);
    const visibleFullCards = Math.max(
      1,
      Math.floor(scrollElement.clientWidth / cardStep),
    );
    const maxStartIndex = Math.max(
      0,
      scrollElement.children.length - visibleFullCards,
    );
    const currentStartIndex = Math.round(scrollElement.scrollLeft / cardStep);
    const pageSize = Math.min(3, Math.max(1, visibleFullCards - 1));
    const nextStartIndex =
      direction === "forward"
        ? Math.min(currentStartIndex + pageSize, maxStartIndex)
        : Math.max(currentStartIndex - pageSize, 0);

    scrollElement.scrollTo({
      left: nextStartIndex * cardStep,
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
              top: 104,
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
              top: 104,
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
            pr: { xs: 0, md: 8 },
            scrollSnapType: { xs: "x proximity", md: "none" },
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
