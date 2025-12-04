import { Box, Container, Typography } from "@mui/material";
import CategoryChip from "./CategoryChip";
import { ICategory } from "../../../data/Sides";
import { Colors } from "../../../theme";
import { useEffect, useRef, useState } from "react";

interface CategoryProps {
  error: string | null;
  categories: ICategory[];
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
}

// Custom smooth scroll with easing
const smoothScrollTo = (targetY: number, duration: number = 1000) => {
  const startY = window.scrollY;
  const difference = targetY - startY;
  const startTime = performance.now();

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + difference * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

export const CategoriesBar = ({
  error,
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
}: CategoryProps) => {
  const categoryRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const isClickScrolling = useRef(false);
  const targetCategoryId = useRef<number | null>(null);
  const [pendingCategoryId, setPendingCategoryId] = useState<number | null>(
    null,
  );

  // Scroll the category chip into view when selected (only if hidden)
  useEffect(() => {
    if (
      selectedCategoryId !== null &&
      categoryRefs.current[selectedCategoryId]
    ) {
      categoryRefs.current[selectedCategoryId]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [selectedCategoryId]);

  // Add scroll listener to auto-select category
  useEffect(() => {
    const handleScroll = () => {
      // Skip auto-selection while user is clicking to scroll
      if (isClickScrolling.current) {
        // Check if we've reached the target section
        if (targetCategoryId.current !== null) {
          const targetSection = document.getElementById(
            `categoryId-${targetCategoryId.current}`,
          );
          if (targetSection) {
            const rect = targetSection.getBoundingClientRect();
            const offset = 150;
            // Check if target is now at the expected position (with some tolerance)
            if (Math.abs(rect.top - offset) < 20) {
              // Clear pending and set selected
              setPendingCategoryId(null);
              setSelectedCategoryId(targetCategoryId.current);
              isClickScrolling.current = false;
              targetCategoryId.current = null;
            }
          }
        }
        return;
      }

      const offset = 180;

      for (const category of categories) {
        const section = document.getElementById(`categoryId-${category.id}`);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom > offset) {
            setSelectedCategoryId(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, setSelectedCategoryId]);

  // Detect when scrolling stops
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScrollEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (isClickScrolling.current) {
          // Finalize selection when scroll stops
          if (targetCategoryId.current !== null) {
            setPendingCategoryId(null);
            setSelectedCategoryId(targetCategoryId.current);
          }
          isClickScrolling.current = false;
          targetCategoryId.current = null;
        }
      }, 150);
    };

    window.addEventListener("scroll", handleScrollEnd);
    return () => {
      window.removeEventListener("scroll", handleScrollEnd);
      clearTimeout(scrollTimeout);
    };
  }, [setSelectedCategoryId]);

  const handleOnCategoryClick = (id: number) => {
    // Set pending state immediately (shows lighter border)
    setPendingCategoryId(id);

    // Disable scroll listener temporarily
    isClickScrolling.current = true;
    targetCategoryId.current = id;

    const section = document.getElementById(`categoryId-${id}`);
    if (section) {
      const offset = 150;
      const targetY =
        section.getBoundingClientRect().top + window.scrollY - offset;
      smoothScrollTo(targetY, 1100);
    } else {
      // If section not found, just select it
      setPendingCategoryId(null);
      setSelectedCategoryId(id);
      isClickScrolling.current = false;
      targetCategoryId.current = null;
    }
  };

  if (error) {
    return (
      <Typography sx={{ display: "flex", justifyContent: "center" }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        borderTopWidth: 1,
        borderStyle: "solid",
        borderColor: Colors.border.default,
        position: "sticky",
        height: "70px",
        alignItems: "center",
        display: "flex",
        top: "68px",
        zIndex: "100",
        backgroundColor: Colors.background.light,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          ml: { xs: 0, sm: 0, md: 0, lg: 0, xl: "57px" },
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {categories.length === 0 && (
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
              mt: 2,
            }}
          >
            No categories Found
          </Typography>
        )}
        {categories.map((category) => (
          <div
            key={category.id}
            ref={(el) => {
              categoryRefs.current[category.id] = el;
            }}
          >
            <CategoryChip
              data={category}
              onClick={() => handleOnCategoryClick(category.id)}
              selected={selectedCategoryId === category.id}
              pending={pendingCategoryId === category.id}
            />
          </div>
        ))}
      </Container>
    </Box>
  );
};

export default CategoriesBar;
