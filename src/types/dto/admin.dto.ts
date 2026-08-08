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

export const ProvisionRestaurantRequestBodySchema = z.object({
  provisioningId: z.string().uuid(),
  restaurant: z.object({
    name: z.string().trim().min(1).max(200),
    image: z.string().url(),
    address: z.string().trim().max(500).optional(),
    description: z.string().trim().max(1000).optional(),
    tags: z.array(z.string()),
    openingAt: z.string().trim().min(1),
    closingAt: z.string().trim().min(1),
    minimumValue: z.number().min(0),
    deliveryCharge: z.number().min(0),
    commissionPercentage: z.number().min(0).max(100),
    cuisine: z.string().trim().optional(),
  }),
  owner: z.object({
    firstName: z.string().trim().min(1).max(50),
    lastName: z.string().trim().min(1).max(50),
    email: z.string().trim().email(),
  }),
});

export type ProvisionRestaurantRequestBodyDTO = z.infer<
  typeof ProvisionRestaurantRequestBodySchema
>;
