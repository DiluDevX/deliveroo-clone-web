import { z } from "zod";

export const restaurantFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Restaurant name is required")
    .max(200, "Restaurant name is too long")
    .regex(
      /^[a-zA-Z0-9\s'&\-.,]+$/,
      "Restaurant name contains unsupported characters",
    ),
  cuisine: z
    .string()
    .trim()
    .min(1, "Cuisine type is required")
    .max(100, "Cuisine type is too long")
    .regex(/^[a-zA-Z\s'\-&]+$/, "Cuisine contains unsupported characters"),
  image: z
    .string()
    .trim()
    .min(1, "Image URL is required")
    .url("Image must be a valid URL"),
  address: z.string().trim().max(500, "Address is too long"),
  description: z.string().trim().max(1000, "Description is too long"),
  tags: z.string().trim(),
  openingAt: z.string().trim().min(1, "Opening time is required"),
  closingAt: z.string().trim().min(1, "Closing time is required"),
  minimumValue: z
    .string()
    .trim()
    .refine(
      (val) => Number.isFinite(Number(val)) && Number(val) >= 0,
      "Minimum value must be a positive number",
    ),
  deliveryCharge: z
    .string()
    .trim()
    .refine(
      (val) => Number.isFinite(Number(val)) && Number(val) >= 0,
      "Delivery charge must be a positive number",
    ),
  commissionPercentage: z
    .string()
    .trim()
    .refine(
      (val) =>
        Number.isFinite(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
      "Commission percentage must be between 0 and 100",
    ),
  ownerFirstName: z
    .string()
    .trim()
    .min(1, "Owner first name is required")
    .max(50, "Owner first name is too long"),
  ownerLastName: z
    .string()
    .trim()
    .min(1, "Owner last name is required")
    .max(50, "Owner last name is too long"),
  adminEmail: z.string().trim().email({ message: "Invalid email" }),
});
