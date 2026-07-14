import { z } from "zod";
import {
  EmptyRequestPathParamsSchema,
  EmptyRequestQueryParamsSchema,
} from "./common.dto";
import { UserSchema } from "./model.schemas";

export const VerifyApiKeyRequestBodySchema = z.object({
  apiKey: z.string(),
  email: z.string(),
  password: z.string(),
});
export type VerifyApiKeyRequestBodyDTO = z.infer<
  typeof VerifyApiKeyRequestBodySchema
>;

export const VerifyApiKeyRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type VerifyApiKeyRequestQueryParamsDTO = z.infer<
  typeof VerifyApiKeyRequestQueryParamsSchema
>;

export const VerifyApiKeyRequestPathParamsSchema = EmptyRequestPathParamsSchema;
export type VerifyApiKeyRequestPathParamsDTO = z.infer<
  typeof VerifyApiKeyRequestPathParamsSchema
>;

export const VerifyApiKeyResponseBodySchema = z.object({
  valid: z.boolean(),
  user: UserSchema.optional(),
});
export type VerifyApiKeyResponseBodyDTO = z.infer<
  typeof VerifyApiKeyResponseBodySchema
>;

export const UpdateRestaurantAdminRequestBodySchema = z.object({
  data: UserSchema.partial(),
});
export type UpdateRestaurantAdminRequestBodyDTO = z.infer<
  typeof UpdateRestaurantAdminRequestBodySchema
>;

export const UpdateRestaurantAdminRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type UpdateRestaurantAdminRequestQueryParamsDTO = z.infer<
  typeof UpdateRestaurantAdminRequestQueryParamsSchema
>;

export const UpdateRestaurantAdminRequestPathParamsSchema = z.object({
  userId: z.string(),
});
export type UpdateRestaurantAdminRequestPathParamsDTO = z.infer<
  typeof UpdateRestaurantAdminRequestPathParamsSchema
>;

export const UpdateRestaurantAdminResponseBodySchema = z.object({
  user: UserSchema,
});
export type UpdateRestaurantAdminResponseBodyDTO = z.infer<
  typeof UpdateRestaurantAdminResponseBodySchema
>;

export const CreateRestaurantAdminRequestBodySchema = z.object({
  email: z.string(),
  password: z.string(),
  role: z.literal("restaurant_user"),
  restaurantRole: z.literal("super_admin"),
  firstName: z.string(),
  lastName: z.string(),
});
export type CreateRestaurantAdminRequestBodyDTO = z.infer<
  typeof CreateRestaurantAdminRequestBodySchema
>;

export const CreateRestaurantAdminRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type CreateRestaurantAdminRequestQueryParamsDTO = z.infer<
  typeof CreateRestaurantAdminRequestQueryParamsSchema
>;

export const CreateRestaurantAdminRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type CreateRestaurantAdminRequestPathParamsDTO = z.infer<
  typeof CreateRestaurantAdminRequestPathParamsSchema
>;

export const CreateRestaurantAdminResponseBodySchema = z.object({
  user: UserSchema,
});
export type CreateRestaurantAdminResponseBodyDTO = z.infer<
  typeof CreateRestaurantAdminResponseBodySchema
>;
