import {
  Box,
  Button as MuiButton,
  Container,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CategoryChip from "./CategoryChip";
import { ICategory } from "../../../data/Sides";
import { Colors } from "../../../theme";
import { useCallback, useEffect, useRef, useState } from "react";

const categoryHoverColor = "rgba(0, 204, 188, 0.12)";
const moreButtonReservedWidth = 118;

interface CategoryProps {
  error: string | null;
  categories: ICategory[];
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  isLoading?: boolean;
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
  isLoading = false,
}: CategoryProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const isClickScrolling = useRef(false);
  const targetCategoryId = useRef<string | null>(null);
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(
    null,
  );
  const [moreAnchorEl, setMoreAnchorEl] = useState<HTMLElement | null>(null);
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(
    categories.length,
  );
  const isMobile = useMediaQuery("(max-width:599.95px)");
  const isTablet = useMediaQuery("(min-width:600px) and (max-width:899.95px)");
  const visibleCategories = categories.slice(0, visibleCategoryCount);
  const overflowCategories = categories.slice(visibleCategoryCount);
  const selectedOverflowCategory = overflowCategories.find(
    (category) => category.id === selectedCategoryId,
  );
  const isMoreSelected = Boolean(selectedOverflowCategory);
  const isMoreOpen = Boolean(moreAnchorEl);
  const estimateCategoryWidth = useCallback(
    (categoryName: string) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        return isMobile ? 152 : isTablet ? 190 : 150;
      }

      context.font = "800 16px IBM Plex Sans";

      const textWidth = context.measureText(categoryName).width;
      const horizontalPadding = isMobile ? 28 : isTablet ? 34 : 28;
      const rightMargin = isMobile ? 8 : isTablet ? 12 : 16;
      const maxWidth = isMobile
        ? 152
        : isTablet
          ? 190
          : Number.POSITIVE_INFINITY;

      return Math.min(textWidth + horizontalPadding, maxWidth) + rightMargin;
    },
    [isMobile, isTablet],
  );

  const updateVisibleCategoryCount = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;

    if (containerWidth <= 0 || categories.length === 0) {
      setVisibleCategoryCount(categories.length);
      return;
    }

    const totalWidth = categories.reduce(
      (width, category) => width + estimateCategoryWidth(category.name),
      0,
    );

    if (totalWidth <= containerWidth) {
      setVisibleCategoryCount(categories.length);
      return;
    }

    const availableWidth = Math.max(
      0,
      containerWidth - moreButtonReservedWidth,
    );
    let usedWidth = 0;
    let nextVisibleCount = 0;

    for (const category of categories) {
      const categoryWidth = estimateCategoryWidth(category.name);

      if (usedWidth + categoryWidth > availableWidth) {
        break;
      }

      usedWidth += categoryWidth;
      nextVisibleCount += 1;
    }

    setVisibleCategoryCount(Math.max(1, nextVisibleCount));
  }, [categories, estimateCategoryWidth]);

  useEffect(() => {
    updateVisibleCategoryCount();

    const containerElement = containerRef.current;
    if (!containerElement) {
      return;
    }

    const resizeObserver = new ResizeObserver(updateVisibleCategoryCount);
    resizeObserver.observe(containerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateVisibleCategoryCount]);

  // Scroll the category chip into view when selected (only if hidden)
  useEffect(() => {
    if (isMoreSelected) {
      moreButtonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
      return;
    }

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
  }, [isMoreSelected, selectedCategoryId]);

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

  const handleOnCategoryClick = (id: string) => {
    setMoreAnchorEl(null);
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
        height: "64px",
        alignItems: "center",
        display: "flex",
        top: "68px",
        zIndex: "100",
        backgroundColor: Colors.background.light,
      }}
    >
      <Container
        ref={containerRef}
        maxWidth={false}
        sx={{
          ml: { xs: 0, sm: 0, md: 0, lg: 0, xl: "57px" },
          width: "auto",
          flex: 1,
          display: "flex",
          alignItems: "center",
          minWidth: 0,
          overflowX: "auto",
          flexWrap: "nowrap",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width={index === 0 ? 92 : 132}
              height={34}
              sx={{ borderRadius: "20px", mr: 1.25 }}
            />
          ))}
        {!isLoading && categories.length === 0 && (
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
        {!isLoading &&
          visibleCategories.map((category) => (
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
        {overflowCategories.length > 0 && (
          <>
            <MuiButton
              ref={moreButtonRef}
              endIcon={<KeyboardArrowDownIcon />}
              onClick={(event) => setMoreAnchorEl(event.currentTarget)}
              sx={{
                ml: { xs: 0, sm: 0.5 },
                borderRadius: "999px",
                px: {
                  xs: isMoreSelected ? 1.65 : 1.1,
                  sm: isMoreSelected ? 2 : 1.25,
                  md: isMoreSelected ? 1.8 : 1.1,
                },
                py: 0.45,
                minWidth: 0,
                maxWidth: { xs: 164, sm: 210, md: 260 },
                flexShrink: 0,
                whiteSpace: "nowrap",
                textTransform: "none",
                fontWeight: isMoreSelected ? 800 : 500,
                color: isMoreSelected
                  ? Colors.text.inverse
                  : Colors.background.brand,
                backgroundColor: isMoreSelected
                  ? Colors.background.brand
                  : "transparent",
                transition: "background-color 0.18s ease, color 0.18s ease",
                "@media (hover: hover) and (pointer: fine)": {
                  "&:hover": {
                    backgroundColor: isMoreSelected
                      ? Colors.background.brandHover
                      : categoryHoverColor,
                    color: isMoreSelected
                      ? Colors.text.inverse
                      : Colors.background.brand,
                  },
                },
                "& .MuiButton-endIcon": {
                  ml: 0.5,
                  flexShrink: 0,
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "block",
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedOverflowCategory?.name ?? "More"}
              </Box>
            </MuiButton>
            <Menu
              anchorEl={moreAnchorEl}
              open={isMoreOpen}
              onClose={() => setMoreAnchorEl(null)}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 190,
                  borderRadius: 2,
                },
              }}
            >
              {overflowCategories.map((category) => (
                <MenuItem
                  key={category.id}
                  selected={selectedCategoryId === category.id}
                  onClick={() => handleOnCategoryClick(category.id)}
                  sx={{
                    color:
                      selectedCategoryId === category.id
                        ? Colors.background.brand
                        : Colors.text.default,
                    fontWeight: selectedCategoryId === category.id ? 800 : 500,
                  }}
                >
                  {category.name}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Container>
    </Box>
  );
};

export default CategoriesBar;
