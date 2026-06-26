import {
  Box,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import InfoButton from "../components/InfoButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarIcon from "@mui/icons-material/Star";
import LocationSelector from "../components/LocationSelector";
import Button from "../components/Button";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { useState } from "react";
import { Colors } from "../../../theme";
import { Restaurant } from "../../../types/restaurants";
import NotFoundScreen from "../components/NotFoundScreen";

const RestaurantInfoView = ({
  isLoading = false,
  restaurant,
}: {
  isLoading?: boolean;
  restaurant: Restaurant | null;
}) => {
  const [imageError, setImageError] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  if (isLoading) {
    return (
      <Container
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
          <Skeleton
            animation="wave"
            variant="rounded"
            width={86}
            height={34}
            sx={{ borderRadius: 1 }}
          />
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
            <Skeleton
              animation="wave"
              variant="rounded"
              sx={{
                width: "100%",
                minHeight: {
                  xs: 220,
                  sm: 180,
                  md: 220,
                },
                height: "100%",
                borderRadius: {
                  xs: 0,
                  sm: 2,
                  md: 2,
                },
              }}
            />
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
            <Skeleton animation="wave" width="70%" height={44} />
            <Skeleton animation="wave" width="45%" height={28} />
            <Skeleton animation="wave" width="62%" height={28} />
            <Box sx={{ mt: 2 }}>
              <Skeleton
                animation="wave"
                variant="rounded"
                width="100%"
                height={58}
                sx={{ borderRadius: 2, mb: 1.5 }}
              />
              <Skeleton
                animation="wave"
                variant="rounded"
                width="100%"
                height={58}
                sx={{ borderRadius: 2 }}
              />
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
            <Skeleton
              animation="wave"
              variant="rounded"
              width={270}
              height={56}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={190}
              height={44}
              sx={{ borderRadius: 1, mt: 2 }}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }

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
            onClick={() => globalThis.history.back()}
            sx={{
              "&:hover": {
                border: "none",
              },
              border: "none",
              gap: { xs: "0.35rem", sm: "0.45rem", md: "0.5rem" },
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
                flexWrap: { xs: "wrap", sm: "nowrap" },
                fontSize: { xs: "0.85rem", sm: "1rem" },
                gap: { xs: "0.5rem", sm: 0 },
              }}
            >
              <Typography variant="body1" component="span">
                Opens at {restaurant.openingAt}
              </Typography>
              <Typography
                sx={{
                  mx: { xs: 0.15, sm: 1 },
                  display: "inline",
                }}
                component="span"
              >
                •
              </Typography>
              <Typography variant="body1" component="span">
                ${restaurant.minimumValue} minimum
              </Typography>
              <Typography
                sx={{
                  mx: { xs: 0.15, sm: 1 },
                  display: "inline",
                }}
                component="span"
              >
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
              onClick={() => setIsInfoOpen(true)}
            />
            <InfoButton
              title="4.8 Excellent (500+)"
              description="Tasty Food"
              Icon={<StarOutlinedIcon sx={{ color: Colors.icon.star }} />}
              onClick={() => setIsReviewsOpen(true)}
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
        <Dialog
          open={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: { xs: 0, sm: "8px" },
              maxHeight: { xs: "100dvh", sm: "calc(100dvh - 48px)" },
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: `1px solid ${Colors.border.default}`,
              fontWeight: 800,
              position: "relative",
            }}
          >
            Info
            <IconButton
              aria-label="Close restaurant info"
              onClick={() => setIsInfoOpen(false)}
              sx={{ position: "absolute", right: 12 }}
            >
              <CloseIcon sx={{ color: Colors.background.brand }} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Box
              sx={{ p: 3, borderBottom: `1px solid ${Colors.border.default}` }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Allergens
              </Typography>
              <Typography sx={{ color: Colors.text.default, mb: 2 }}>
                Questions about allergens, ingredients or cooking methods? Ask{" "}
                {restaurant.name} before ordering.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalPhoneOutlinedIcon
                  sx={{ color: Colors.background.brand, fontSize: "1.25rem" }}
                />
                <Typography
                  sx={{
                    color: Colors.background.brand,
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  Contact the store
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{ p: 3, borderBottom: `1px solid ${Colors.border.default}` }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Location
              </Typography>
              <Box
                sx={{
                  height: 180,
                  borderRadius: 1,
                  backgroundColor: Colors.background.default,
                  border: `1px solid ${Colors.border.default}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: Colors.text.placeholder,
                  mb: 2,
                }}
              >
                <MapOutlinedIcon sx={{ mr: 1 }} />
                Map preview
              </Box>
              <Typography sx={{ color: Colors.text.default }}>
                {restaurant.address || "Address not available"}
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Restaurant details
              </Typography>
              <Typography sx={{ color: Colors.text.lighter }}>
                {restaurant.description ||
                  `${restaurant.name} serves ${restaurant.cuisine || "fresh meals"}.`}
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
        <Dialog
          open={isReviewsOpen}
          onClose={() => setIsReviewsOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: { xs: 0, sm: "8px" },
              maxHeight: { xs: "100dvh", sm: "calc(100dvh - 48px)" },
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: `1px solid ${Colors.border.default}`,
              fontWeight: 800,
              position: "relative",
            }}
          >
            Reviews
            <IconButton
              aria-label="Close restaurant reviews"
              onClick={() => setIsReviewsOpen(false)}
              sx={{ position: "absolute", right: 12 }}
            >
              <CloseIcon sx={{ color: Colors.background.brand }} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Box
              sx={{ p: 3, borderBottom: `1px solid ${Colors.border.default}` }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "150px 1fr" },
                  gap: 3,
                  alignItems: "center",
                }}
              >
                <Box sx={{ textAlign: { xs: "left", sm: "center" } }}>
                  <Typography
                    sx={{
                      color: Colors.background.brand,
                      fontSize: "2.6rem",
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    4.8
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "flex-start", sm: "center" },
                      color: Colors.background.brand,
                    }}
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon key={index} sx={{ fontSize: 18 }} />
                    ))}
                  </Box>
                  <Typography sx={{ color: Colors.text.placeholder }}>
                    128 reviews
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {[5, 4, 3, 2, 1].map((rating, index) => (
                    <Box
                      key={rating}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "20px 1fr",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ color: Colors.text.placeholder }}>
                        {rating}
                      </Typography>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: "999px",
                          backgroundColor: Colors.border.default,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${[86, 34, 12, 6, 18][index]}%`,
                            height: "100%",
                            backgroundColor: Colors.background.brand,
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                All reviews
              </Typography>
              {[
                {
                  date: "2 days ago",
                  text: "Food arrived warm, portions were generous, and the flavours were spot on.",
                  tags: ["Tasty food", "Good portion size"],
                },
                {
                  date: "1 week ago",
                  text: "Quick delivery and the order was packed neatly. Would order again.",
                  tags: ["Fast delivery", "Well packed"],
                },
                {
                  date: "2 weeks ago",
                  text: "Really fresh ingredients and the sauce had a good balance.",
                  tags: ["Fresh ingredients", "Great flavour"],
                },
                {
                  date: "3 weeks ago",
                  text: "Good value for the price and the portion was enough for dinner.",
                  tags: ["Good value", "Filling portion"],
                },
                {
                  date: "1 month ago",
                  text: "The food was tasty, but delivery took a little longer than expected.",
                  tags: ["Tasty food"],
                },
              ].map((review) => (
                <Box
                  key={review.text}
                  sx={{
                    py: 2,
                    borderBottom: `1px solid ${Colors.border.default}`,
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>
                    Deliveroo customer
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ color: Colors.icon.star }}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <StarIcon key={index} sx={{ fontSize: 16 }} />
                      ))}
                    </Box>
                    <Typography sx={{ color: Colors.text.placeholder }}>
                      {review.date}
                    </Typography>
                  </Box>
                  <Typography sx={{ my: 1 }}>{review.text}</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {review.tags.map((tag) => (
                      <Box
                        key={tag}
                        sx={{
                          px: 1.1,
                          py: 0.4,
                          borderRadius: "4px",
                          backgroundColor: `${Colors.background.brand}1f`,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          component="span"
                          sx={{
                            color: Colors.background.brand,
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            lineHeight: 1.3,
                          }}
                        >
                          {tag}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
              <Button
                variant="filled"
                onClick={() => setIsReviewsOpen(false)}
                sx={{ width: "100%", mt: 3, py: 1.5, fontWeight: 800 }}
              >
                Back to menu
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    );
  }
};

export default RestaurantInfoView;
