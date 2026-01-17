import { Box, Container, Grid2 as Grid, Typography } from "@mui/material";
import InfoButton from "../components/InfoButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import LocationSelector from "../components/LocationSelector";
import Button from "../components/Button";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { Colors } from "../../../theme";
import { Restaurant } from "../../../types/restaurants";
import NotFoundScreen from "../components/NotFoundScreen";

const RestaurantInfoView = ({
  restaurant,
}: {
  restaurant: Restaurant | null;
}) => {
  const [imageError, setImageError] = useState(false);

  if (!restaurant) {
    return <NotFoundScreen text="Restaurant not found" />;
  }

  if (restaurant) {
    return (
      <Container
        key={restaurant.name}
        disableGutters
        maxWidth="xl"
        sx={{
          px: {
            xs: 0,
            sm: 2,
            md: 2,
          },
          py: 3,
        }}
      >
        <Box sx={{ paddingBottom: "1rem" }}>
          <Button
            PrefixComponent={<ArrowBackIcon sx={{ height: "1.3rem" }} />}
            onClick={() => window.history.back()}
            sx={{
              "&:hover": {
                border: "none",
              },
              border: "none",
              gap: { xs: "0.2rem", sm: "0.3rem", md: 0 },
              color: Colors.background.brand,
              fontSize: "1rem",
              fontWeight: "normal",
              left: { xs: 0, sm: "-20px", md: "-20px", lg: "-20px" },
              display: "flex",
              alignItems: "left",
              justifyContent: "left",
            }}
          >
            Back
          </Button>
        </Box>
        <Grid container>
          <Grid
            size={{
              xs: 12,
              sm: 3,
              md: 4,
              lg: 3,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: {
                  xs: 0,
                  sm: 2,
                  md: 2,
                  overflow: "hidden",
                },
                boxShadow: `0px 1px 1px 0.5px  ${Colors.border.subtle}`,
                backgroundImage: imageError
                  ? "url(https://assets.dilum.me/deliveroo-clone/svgs/placeholder-menu.svg)"
                  : "none",
                backgroundPosition: "center",
                backgroundSize: "contain",
              }}
            >
              <img
                alt=""
                src={restaurant.image}
                onError={() => setImageError(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  backgroundImage:
                    "url(https://assets.dilum.me/deliveroo-clone/svgs/placeholder-menu.svg)",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                }}
              />
            </Box>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 9,
              md: 8,
              lg: 5,
            }}
            sx={{
              px: 2,
              mt: { xs: 2, sm: 2, md: 2, lg: 0 },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
              }}
            >
              {restaurant.name}
            </Typography>
            <Box
              sx={{
                mt: 1,
                display: "flex",
              }}
            >
              {restaurant.tags?.map((tag, index) => (
                <Box key={index + tag} component="span">
                  <Typography variant="body1" component="span">
                    {tag}
                  </Typography>
                  {restaurant.tags?.length > index + 1 && (
                    <Typography sx={{ mx: 1 }} component="span">
                      •
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                mt: 1,
                display: "flex",
                whiteSpace: "nowrap",
              }}
            >
              <Typography variant="body1" component="span">
                Opens at {restaurant.openingAt}
              </Typography>
              <Typography sx={{ mx: 1 }} component="span">
                •
              </Typography>
              <Typography variant="body1" component="span">
                ${restaurant.minimumValue} minimum
              </Typography>
              <Typography sx={{ mx: 1 }} component="span">
                •
              </Typography>
              <Typography variant="body1" component="span">
                ${restaurant.deliveryCharge} delivery
              </Typography>
            </Box>

            <InfoButton
              title="Info"
              description="Map, allergens and hygiene rating"
              Icon={<InfoOutlinedIcon sx={{ color: Colors.icon.info }} />}
            />
            <InfoButton
              title="4.8 Excellent (500+)"
              description="Tasty Food"
              Icon={<StarOutlinedIcon sx={{ color: Colors.icon.star }} />}
            />
            <Box
              sx={{
                display: {
                  xs: "block",
                  sm: "block",
                  md: "block",
                  lg: "none",
                },
              }}
            >
              <LocationSelector />
              <Button
                variant="border"
                sx={{ my: 2, border: "0.5px solid #ccc" }}
                PrefixComponent={
                  <PeopleOutlineOutlinedIcon
                    sx={{ mr: 1, color: Colors.background.brand }}
                  />
                }
              >
                Start Group Order
              </Button>
            </Box>
          </Grid>
          <Grid
            size={{
              lg: 4,
            }}
            sx={{
              display: {
                xs: "none",
                sm: "none",
                md: "none",
                lg: "flex",
              },
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <LocationSelector />
            <Button
              variant="border"
              sx={{ my: 2, border: `0.5px solid ${Colors.border.subtle}` }}
              PrefixComponent={
                <PeopleOutlineOutlinedIcon
                  sx={{ mr: 1, color: Colors.background.brand }}
                />
              }
            >
              Start Group Order
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }
};

export default RestaurantInfoView;
