import { Box, Typography } from "@mui/material";
import { Colors } from "../../../theme";

const categoryHoverColor = "rgba(0, 204, 188, 0.12)";

type CategoryChipProps = {
  data: {
    id: string;
    name: string;
  };
  onClick: (id: string) => void;
  selected: boolean;
  pending?: boolean;
  compact?: boolean;
};

const CategoryChip = ({
  data,
  onClick,
  selected,
  pending = false,
  compact = false,
}: CategoryChipProps) => {
  const handleOnClick = () => {
    onClick(data.id);
  };

  return (
    <Box
      onClick={handleOnClick}
      sx={{
        backgroundColor: selected ? Colors.background.brand : "transparent",
        color: selected ? Colors.text.inverse : Colors.background.brand,
        borderRadius: "999px",
        border: pending
          ? `2px solid ${Colors.background.brand}80`
          : "2px solid transparent",
        fontWeight: selected ? 800 : 500,
        cursor: "pointer",
        mr: compact ? 0 : { xs: 1, sm: 1.5, md: 2 },
        px: compact
          ? 1
          : {
              xs: selected ? 1.65 : 1.1,
              sm: selected ? 2 : 1.25,
              md: selected ? 1.8 : 1.1,
            },
        py: 0.45,
        width: compact ? "100%" : "auto",
        minWidth: 0,
        maxWidth: compact ? "100%" : { xs: 152, sm: 190, md: "none" },
        overflow: "hidden",
        whiteSpace: "nowrap",
        transition:
          "background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease",
        "@media (hover: hover) and (pointer: fine)": {
          "&:hover": {
            backgroundColor: selected
              ? Colors.background.brandHover
              : categoryHoverColor,
            color: selected ? Colors.text.inverse : Colors.background.brand,
          },
        },
      }}
    >
      <Typography
        sx={{
          color: "inherit",
          fontWeight: "inherit",
          fontSize: { xs: "0.95rem", md: "1rem" },
          lineHeight: 1.35,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {data.name}
      </Typography>
    </Box>
  );
};

export default CategoryChip;
