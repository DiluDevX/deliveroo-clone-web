import { Box, Typography } from "@mui/material";

const NotFoundScreen = ({ text }: { text: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "6rem",
        width: "100%",
        maxWidth: { xs: "100vw", md: "70vw", lg: "70vw" },
        paddingLeft: { md: "6rem", lg: "8rem" },
        mt: 4,
        mb: 10,
      }}
    >
      <Typography
        variant="h6"
        color="gray"
        sx={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          textWrap: "nowrap",
        }}
        component="div"
      >
        {text}
      </Typography>
      <img
        src="https://assets.dilum.me/deliveroo-clone/svgs/NotFound.svg"
        alt="No Restaurants Found"
        style={{ width: "100%", height: "auto", maxWidth: "300px" }}
      />
    </Box>
  );
};

export default NotFoundScreen;
