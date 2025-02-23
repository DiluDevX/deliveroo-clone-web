import { z } from "zod";

export const createPasswordSchema = z
  .string()
  .min(3, "Password must be at least 8 characters.")
  .max(20, "Password must be at most 20 characters.")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
  );

export const checkPasswordSchema = z.string();
