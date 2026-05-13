import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
}

export const getEmailFromToken = () => {
  const token = localStorage.getItem("email-token");

  let email = "";

  try {
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      email = decodedToken.email;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("token");
  }
  return email;
};
