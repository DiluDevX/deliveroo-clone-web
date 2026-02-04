import axios from "axios";

export const verifyApiKey = async (
  apiKey: string,
  email: string,
  password: string,
) => {
  try {
    const response = await axios.post("/api/admin/verify-api-key", {
      apiKey,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying API key", error);
    return false;
  }
};
