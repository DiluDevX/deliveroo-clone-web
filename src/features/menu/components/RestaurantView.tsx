import { Box, Container, Typography, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import { Colors } from "../../../theme";
import { useState } from "react";
import { Restaurant } from "../../../types/restaurants";
import StarIcon from "@mui/icons-material/Star";
import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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
        to={`/restaurants/${restaurant.id}/menu`}
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
              loading="lazy"
              decoding="async"
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
              padding: "1.2rem",
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
              justifyContent: "space-between",
              textAlign: "left",
              overflow: "hidden",
            }}
          >
            {/* Header: Name & Rating */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  mb: 0.5,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  {restaurant.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.3,
                    whiteSpace: "nowrap",
                  }}
                >
                  <StarIcon
                    sx={{ fontSize: "0.9rem", color: Colors.background.brand }}
                  />
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    4.5
                  </Typography>
                </Box>
              </Box>

              <Typography
                sx={{
                  color: Colors.text.placeholder,
                  fontSize: "0.85rem",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
                  minWidth: 0,
                }}
              >
                {restaurant.tags.join(" • ")}
              </Typography>
            </Box>

            {/* Info Pills */}
            <Box
              sx={{ display: "flex", gap: 0.8, flexWrap: "wrap", minWidth: 0 }}
            >
              <Chip
                icon={
                  <DirectionsBikeOutlinedIcon
                    sx={{ color: Colors.background.brand, fontSize: "0.9rem" }}
                  />
                }
                label={`$${restaurant.deliveryCharge} delivery`}
                size="small"
                sx={{
                  height: "24px",
                  fontSize: { xs: "0.5rem", sm: "0.75rem" },
                  backgroundColor: `${Colors.background.brand}15`,
                  color: Colors.background.brand,
                  fontWeight: 600,
                  "& .MuiChip-icon": { fontSize: "0.9rem", marginLeft: "4px" },
                  "& .MuiChip-label": { px: { xs: "4px", sm: "8px" } },
                }}
              />
              <Chip
                icon={<AccessTimeIcon sx={{ fontSize: "0.9rem" }} />}
                label={`${restaurant.openingAt} - ${restaurant.closingAt}`}
                size="small"
                sx={{
                  height: "24px",
                  fontSize: { xs: "0.5rem", sm: "0.75rem" },
                  backgroundColor: `${Colors.text.placeholder}15`,
                  color: Colors.text.placeholder,
                  fontWeight: 600,
                  "& .MuiChip-icon": { fontSize: "0.9rem", marginLeft: "4px" },
                  "& .MuiChip-label": { px: { xs: "4px", sm: "8px" } },
                }}
              />
            </Box>

            {/* Min Order */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography
                sx={{ fontSize: "0.8rem", color: Colors.text.placeholder }}
              >
                Min order:
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: Colors.text.default,
                }}
              >
                ${restaurant.minimumValue}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Link>
    </Box>
  );
};

export default RestaurantView;
