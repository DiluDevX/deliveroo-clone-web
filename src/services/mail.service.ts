import axios from "axios";

export const sendEmail = async (userName: string) => {
  try {
    const response = await axios.post("/api/auth/forgot-password", {
      userName,
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
