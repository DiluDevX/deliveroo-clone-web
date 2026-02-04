import axios from "axios";
import { IUser } from "../types/user.types";

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

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const response = await axios.get("/api/users/all");
    console.log("getAllUsers response:", response.data.data);
    if (!response.data) {
      throw new Error("Failed to fetch all Users.");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all Users.", error);
    return [];
  }
};
