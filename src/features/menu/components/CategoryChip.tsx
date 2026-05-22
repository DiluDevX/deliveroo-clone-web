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
        transition: "border 0.2s ease",
      }}
    >
      <Typography>{data.name}</Typography>
    </Box>
  );
};

export default CategoryChip;
