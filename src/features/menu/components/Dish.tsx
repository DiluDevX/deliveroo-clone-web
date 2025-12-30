import { Box, Card, Typography } from "@mui/material";
import { IDish } from "../../../data/Sides";
import Button from "./Button";
import AddIcon from "@mui/icons-material/Add";
import { Colors } from "../../../theme";
import { useAppDispatch } from "../../../store/hooks/cartHooks";
import { addItemAndSync } from "../../../store/cartSlice";

type DishProps = {
  data: IDish;
};

const Dish = ({ data }: DishProps) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addItemAndSync(data));
  };
  return (
    <Card
      sx={{
        border: `1px solid ${Colors.border.default}`,
        borderRadius: "12px",
        overflow: "hidden",
        p: 2,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "150px",
        width: "100%",
        maxHeight: "150px",
        maxWidth: "600px",
        boxShadow: `0px 2px 8px ${Colors.boxShadow.default}`,
        backgroundColor: Colors.background.defaultLight,
      }}
    >
      <Box
        sx={{
          width: "100px",
          height: "100px",
          borderRadius: "8px",
          overflow: "hidden",
          mr: 2,
        }}
      >
        <img
          src="/salad.jpeg"
          alt={data.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundImage: "url(/svgs/placeholder-menu.svg)",
            backgroundPosition: "center",
            backgroundSize: "contain",
          }}
        />
      </Box>

      <Box
        sx={{
          height: "100%",
          width: "100%",
          fontSize: "0.5rem",
          flex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bolder",
            fontSize: "1rem",
            mb: 0.5,
          }}
        >
          {data.name}
        </Typography>
        <Typography
          sx={{
            color: Colors.text.lighter,
            fontSize: "0.7rem",
            mb: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {data.description}
        </Typography>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "0.8rem",
            color: Colors.text.default,
          }}
        >
          $ {parseFloat(data.price).toFixed(2)}
        </Typography>
      </Box>

      <Button
        onClick={handleAddToCart}
        sx={{
          backgroundColor: Colors.background.defaultLight,
          color: Colors.text.inverse,
          border: `1px solid ${Colors.border.subtle}`,
          borderRadius: "4px",
          width: "auto",
          maxWidth: "50px",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ml: "10px",
        }}
      >
        <AddIcon
          sx={{
            color: Colors.text.default,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 1,
          }}
        />
      </Button>
    </Card>
  );
};

export default Dish;
