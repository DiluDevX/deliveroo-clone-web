import axios from "axios";

export const UpdateUserPassword = async ({
  password,
  user_id,
}: {
  password: string;
  user_id: string;
}) => {
  try {
    const response = await axios.patch(`/api/users/${user_id}`, {
      password,
    });
    if (!response) {
      return new Error("Failed to update password");
    }
    return { message: "Password updated successfully" };
  } catch (error) {
    console.error("Error updating password", error);
    return new Error("Failed to update password");
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get("/api/admin/users");
    if (!response.data) {
      throw new Error("Failed to fetch all Users.");
    }
    const data = await response.data;
    return data.data;
  } catch (error) {
    console.error("Error fetching all Users.", error);
    return [];
  }
};
