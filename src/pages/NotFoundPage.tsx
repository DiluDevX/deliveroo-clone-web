import { Box, Typography, Container } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Colors } from "../theme/colors";
import Button from "../features/menu/components/Button";
import HomeIcon from "@mui/icons-material/Home";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
        paddingY: 4,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {/* 404 Icon */}
        <ErrorOutlineIcon
          sx={{
            fontSize: "7rem",
            color: Colors.background.brand,
            opacity: 0.8,
          }}
        />

        {/* 404 Title */}
        <Typography
          sx={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            color: Colors.text.default,
            lineHeight: 1,
            margin: 0,
          }}
        >
          404
        </Typography>

        {/* Heading */}
        <Typography
          sx={{
            fontSize: "1.8rem",
            fontWeight: "600",
            color: Colors.text.default,
            mb: 1,
          }}
        >
          Page Not Found
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: "1rem",
            color: Colors.text.lighter,
            maxWidth: "400px",
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          Oops! The page you're looking for doesn't exist or has been moved.
          Don't worry, let's get you back on track.
        </Typography>

        {/* Suggested Actions */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            width: "100%",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Button
            onClick={() => navigate({ to: "/" })}
            variant="filled"
            PrefixComponent={
              <HomeIcon sx={{ height: "1.3rem", width: "auto" }} />
            }
            sx={{
              flex: { xs: 1, sm: "auto" },
              minWidth: "150px",
              fontWeight: "600",
            }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Additional Help Text */}
        <Typography
          sx={{
            fontSize: "0.9rem",
            color: Colors.text.placeholder,
            mt: 4,
            maxWidth: "400px",
          }}
        >
          If you believe this is a mistake, please contact our support team.
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
