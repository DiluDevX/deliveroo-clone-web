import { Box, Card, CardContent, Typography } from "@mui/material";
import Button from "./Button";
import { IDishFake } from "../../../data/Sides";
import AddIcon from "@mui/icons-material/Add";
import { Colors } from "../../../theme";

type SpecialCardProps = {
  data: IDishFake;
};

const SpecialCard = ({ data }: SpecialCardProps) => {
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "150px",
        height: "270px",
        mr: 2,
        my: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "unset",
        backgroundColor: Colors.background.defaultLight,
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "3px",
        borderWidth: 1.5,
        borderStyle: "solid",
        borderColor: Colors.border.default,
      }}
    >
      <img
        src={data.image}
        alt=""
        style={{
          minHeight: 150,
          maxHeight: 150,
          width: "148px",
          borderRadius: "3px",
          objectFit: "cover",
          backgroundImage:
            "url(https://assets.dilum.me/deliveroo-clone/svgs/placeholder-menu.svg)",
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          maxHeight: "70px",
          mb: 1,
          WebkitLineClamp: 1,
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{ fontSize: "0.8rem" }}
          gutterBottom
          variant="h5"
          component="div"
        >
          {data.name}
        </Typography>
      </CardContent>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          sx={{
            width: "89%",
            borderRadius: "3px",
            border: "0.5px solid lightgrey",
            marginBottom: "0.5rem",
            position: "relative",
          }}
        >
          <AddIcon
            sx={{
              height: "1.2rem",
              width: "1.2rem",
              color: Colors.text.default,
            }}
          />
        </Button>
      </Box>
    </Card>
  );
};

export default SpecialCard;
