import { Box, Typography } from "@mui/material";
import { Colors } from "../../../theme";

type CategoryChipProps = {
  data: {
    id: string;
    name: string;
  };
  onClick: (id: string) => void;
  selected: boolean;
  pending?: boolean;
};

const CategoryChip = ({
  data,
  onClick,
  selected,
  pending = false,
}: CategoryChipProps) => {
  const handleOnClick = () => {
    onClick(data.id);
  };

  return (
    <Box
      onClick={handleOnClick}
      sx={{
        backgroundColor: selected
          ? Colors.background.brand
          : Colors.background.defaultLight,
        color: selected ? Colors.text.inverse : Colors.background.brand,
        borderRadius: "20px",
        border: pending
          ? `3px solid ${Colors.background.brand}80`
          : "2px solid transparent",
        fontWeight: selected ? "bold" : "regular",
        cursor: "pointer",
        paddingLeft: "1rem",
        mr: 1,
        px: 2,
        py: 0.5,
        whiteSpace: "nowrap",
        transition:
          "background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease",
        "@media (hover: hover) and (pointer: fine)": {
          "&:hover": {
            backgroundColor: selected
              ? Colors.background.brandHover
              : Colors.background.subtleLight,
            color: selected ? Colors.text.inverse : Colors.text.default,
          },
        },
      }}
    >
      <Typography>{data.name}</Typography>
    </Box>
  );
};

export default CategoryChip;
