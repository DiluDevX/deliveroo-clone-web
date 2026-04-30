import { Box, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Colors } from "../../../theme";
import { useState } from "react";

interface Restaurant {
  name: string;
  image: string;
  description: string;
  tags: string[];
  openingAt: string;
  closingAt: string;
  minimumValue: string;
  deliveryCharge: string;
}

interface RestaurantViewProps {
  restaurant: Restaurant;
}

const RestaurantView = ({ restaurant }: RestaurantViewProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Box
      sx={{
        pb: { xs: 2, md: 4 },
        width: "100%",
      }}
    >
      <Link
        to={`/restaurants/${restaurant.name}/menu`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          width: "100%",
        }}
      >
        <Container
          disableGutters
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: `0px 2px 8px ${Colors.boxShadow.default}`,
            backgroundColor: "white",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              cursor: "pointer",
              boxShadow: `1px 2px 4px ${Colors.background.brandHover}`,
            },
          }}
        >
          {/* Image Section */}
          <Box
            sx={{
              width: { xs: "100%", sm: "40%" },
              height: "200px",
              position: "relative",
              backgroundImage: imageError
                ? "url(https://assets.dilum.me/deliveroo-clone/svgs/placeholder-menu.svg)"
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              onError={() => setImageError(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: imageError ? "none" : "block",
              }}
            />
          </Box>

          {/* Text Section */}
          <Box
            sx={{
              flexGrow: 1,
              minWidth: 0,
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              justifyContent: "center",
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                whiteSpace: "normal",
                wordWrap: "break-word",
                minWidth: 0,
              }}
            >
              {restaurant.name}
            </Typography>

            <Typography
              sx={{
                color: "gray",
                fontSize: "0.875rem",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                minWidth: 0,
              }}
            >
              {restaurant.tags.join(" • ")}
            </Typography>
          </Box>
        </Container>
      </Link>
    </Box>
  );
};

export default RestaurantView;
