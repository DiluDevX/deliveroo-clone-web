import Button from "../features/menu/components/Button";
import { Box, Typography, Divider } from "@mui/material";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import AppleIcon from "@mui/icons-material/Apple";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { Link } from "react-router-dom";
import { Colors, Svgs } from "../theme";

const AuthPage = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "68vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background.light,
        marginTop: "1rem",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "500px",
          padding: "2rem",
          backgroundColor: Colors.background.light,
          borderRadius: "10px",
          textAlign: "center",
          marginTop: "3rem",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign={"left"}
          sx={{ marginBottom: "1rem" }}
        >
          Sign Up or Log In
        </Typography>

        <Button
          PrefixComponent={<FacebookOutlinedIcon />}
          sx={{
            color: Colors.text.inverse,
            backgroundColor: Colors.icon.facebook,
            width: "100%",
            height: "3rem",
            gap: "0.5rem",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          Continue With Facebook
        </Button>

        <Button
          PrefixComponent={<Svgs.GoogleLogo width={"1.5rem"} />}
          sx={{
            color: Colors.text.default,
            border: "1px solid grey",
            marginTop: "0.5rem",
            width: "100%",
            height: "3rem",
            mb: "0.5rem",
            gap: "0.5rem",
            fontWeight: "bold",
            fontSize: "1rem",
            "&:hover": {
              border: "1px solid grey",
            },
          }}
        >
          Continue With Google
        </Button>
        <Button
          PrefixComponent={<AppleIcon />}
          sx={{
            color: Colors.text.inverse,
            backgroundColor: "black",
            marginTop: "0.5rem",
            width: "100%",
            height: "3rem",
            gap: "0.5rem",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          Continue With Apple
        </Button>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            margin: "1.5rem 0",
          }}
        >
          <Divider
            sx={{ flexGrow: 1, backgroundColor: Colors.border.subtle }}
          />
          <Typography
            sx={{
              margin: "0 1rem",
              fontSize: "0.9rem",
              color: Colors.text.default,
            }}
          >
            or
          </Typography>
          <Divider
            sx={{ flexGrow: 1, backgroundColor: Colors.border.subtle }}
          />
        </Box>

        <Link to={"/Account/login"} style={{ textDecoration: "none" }}>
          <Button
            PrefixComponent={<EmailOutlinedIcon />}
            sx={{
              width: "100%",
              color: Colors.text.inverse,
              backgroundColor: Colors.background.brand,
              height: "3rem",
              gap: "0.5rem",
              fontWeight: "bold",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: Colors.background.brandHover,
                border: "none",
              },
            }}
          >
            Continue With Email
          </Button>
        </Link>

        <Typography
          sx={{
            fontSize: "0.75rem",
            marginTop: "1rem",
            width: "100%",
            textAlign: "left",
          }}
        >
          By continuing you agree to our{" "}
          <Link
            to={"https://deliveroo.co.uk/legal"}
            style={{ color: Colors.background.brand }}
          >
            T&Cs.
          </Link>{" "}
          Please also check out our
          <br />
          <Link
            to={"https://deliveroo.co.uk/legal"}
            style={{ color: Colors.background.brand }}
          >
            Privacy Policy.
          </Link>{" "}
          We use your data to offer you a personalized experience and to better
          understand and improve our services.{" "}
          <Link
            to={"https://deliveroo.co.uk/privacy#use-of-your-information"}
            style={{ color: Colors.background.brand }}
          >
            For more information see here.
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthPage;
