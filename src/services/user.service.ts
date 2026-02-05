import axios from "axios";
import { IUser } from "../types/user.types";

export const getAllUsers = async (): Promise<IUser[]> => {
  const response = await axios.get("/api/users/all");
  if (!response.data) {
    throw new Error("Failed to fetch all Users.");
  }
  return response.data.data;
};
