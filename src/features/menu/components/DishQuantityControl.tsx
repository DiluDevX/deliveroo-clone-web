import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import { useEffect, useRef, useState } from "react";
import { Colors } from "../../../theme";
import Button from "./Button";

type DishQuantityControlProps = {
  dishName: string;
  quantity: number;
  compact?: boolean;
  onAdd: () => void | Promise<void>;
  onDecrease: () => void | Promise<void>;
  onIncrease: () => void | Promise<void>;
  onCollapse?: () => void;
};

const DishQuantityControl = ({
  dishName,
  quantity,
  compact = false,
  onAdd,
  onDecrease,
  onIncrease,
  onCollapse,
}: DishQuantityControlProps) => {
  const controlRef = useRef<HTMLDivElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isInCart = quantity > 0;

  useEffect(() => {
    if (!isExpanded) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        controlRef.current &&
        event.target instanceof Node &&
        controlRef.current.contains(event.target)
      ) {
        return;
      }

      setIsExpanded(false);
      onCollapse?.();
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isExpanded, onCollapse]);

  useEffect(() => {
    if (!isInCart) {
      setIsExpanded(false);
    }
  }, [isInCart]);

  const collapsedSize = compact ? 40 : 48;
  const actionSize = compact ? 36 : 44;
  const expandedHeight = compact ? 42 : 48;
  const expandedWidth = compact ? 112 : 132;
  const iconSize = compact ? "1rem" : "1.2rem";

  if (!isInCart) {
    return (
      <Box ref={controlRef}>
        <Button
          aria-label={`Add ${dishName} to cart`}
          onClick={(event) => {
            event.stopPropagation();
            void onAdd();
          }}
          sx={{
            width: compact ? 40 : 48,
            height: compact ? 40 : 48,
            minWidth: compact ? 40 : 48,
            minHeight: compact ? 40 : 48,
            borderRadius: "50%",
            backgroundColor: Colors.background.light,
            border: `1px solid ${Colors.border.default}`,
            boxShadow: `0 3px 10px ${Colors.boxShadow.default}`,
            p: 0,
            transition:
              "width 180ms ease, transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease",
            "&:hover": {
              transform: "scale(1.04)",
            },
          }}
        >
          <AddIcon
            sx={{
              height: iconSize,
              width: iconSize,
              color: Colors.background.brand,
            }}
          />
        </Button>
      </Box>
    );
  }

  return (
    <Box
      ref={controlRef}
      role="group"
      aria-label={`${dishName} quantity controls`}
      onClick={(event) => {
        event.stopPropagation();

        if (!isExpanded) {
          setIsExpanded(true);
        }
      }}
      sx={{
        height: isExpanded ? expandedHeight : collapsedSize,
        width: isExpanded ? expandedWidth : collapsedSize,
        minWidth: isExpanded ? expandedWidth : collapsedSize,
        borderRadius: "999px",
        backgroundColor: isExpanded
          ? Colors.background.light
          : Colors.background.brand,
        border: isExpanded ? `1px solid ${Colors.border.default}` : "none",
        boxShadow: `0 3px 10px ${Colors.boxShadow.default}`,
        display: "grid",
        gridTemplateColumns: isExpanded
          ? `${actionSize}px ${actionSize}px ${actionSize}px`
          : `0px ${collapsedSize}px 0px`,
        alignItems: "center",
        justifyItems: "center",
        transformOrigin: "right center",
        overflow: "hidden",
        transition:
          "width 280ms ease, min-width 280ms ease, height 220ms ease, background-color 220ms ease, border-color 220ms ease, transform 220ms ease",
        "&:hover": {
          backgroundColor: isExpanded
            ? Colors.background.light
            : Colors.background.brandHover,
          transform: isExpanded ? "none" : "scale(1.04)",
        },
      }}
    >
      <IconButton
        aria-label={
          quantity <= 1
            ? `Remove ${dishName} from cart`
            : `Remove one ${dishName}`
        }
        tabIndex={isExpanded ? 0 : -1}
        onClick={(event) => {
          event.stopPropagation();
          void onDecrease();
        }}
        size="small"
        sx={{
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? "translateX(0)" : "translateX(8px)",
          pointerEvents: isExpanded ? "auto" : "none",
          transition: "opacity 180ms ease 80ms, transform 220ms ease 60ms",
        }}
      >
        {quantity <= 1 ? (
          <DeleteOutlineIcon sx={{ color: Colors.background.brand }} />
        ) : (
          <RemoveIcon sx={{ color: Colors.background.brand }} />
        )}
      </IconButton>
      <Typography
        sx={{
          color: isExpanded ? Colors.text.default : Colors.text.inverse,
          fontWeight: 800,
          fontSize: isExpanded
            ? compact
              ? "0.95rem"
              : "1rem"
            : compact
              ? "1rem"
              : "1.1rem",
          transition: "color 180ms ease, font-size 180ms ease",
        }}
      >
        {quantity}
      </Typography>
      <IconButton
        aria-label={`Add one more ${dishName}`}
        tabIndex={isExpanded ? 0 : -1}
        onClick={(event) => {
          event.stopPropagation();
          void onIncrease();
        }}
        size="small"
        sx={{
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? "translateX(0)" : "translateX(-8px)",
          pointerEvents: isExpanded ? "auto" : "none",
          transition: "opacity 180ms ease 80ms, transform 220ms ease 60ms",
        }}
      >
        <AddIcon sx={{ color: Colors.background.brand }} />
      </IconButton>
    </Box>
  );
};

export default DishQuantityControl;
