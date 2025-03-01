import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  firstName: string;
  email: string;
}

export const getNameFromToken = () => {
  const token = localStorage.getItem("token");

  let firstName = "";

  try {
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      firstName = decodedToken.firstName;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("token");
  }
  return firstName;
};

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
