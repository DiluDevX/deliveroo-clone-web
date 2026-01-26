import axios from "axios";

export const sendEmail = async (email: string) => {
  try {
    const response = await axios.post("/api/auth/forgot-password", {
      email,
    });
    if (!response) {
      return new Error("Failed to send email");
    }
    return { message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email", error);
    return new Error("Failed to send email");
  }
};
