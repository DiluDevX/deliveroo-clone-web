import { z } from "zod";
import {
  EmptyRequestBodySchema,
  EmptyRequestPathParamsSchema,
  EmptyRequestQueryParamsSchema,
} from "./common.dto";
import { CartItemSchema } from "./model.schemas";

export const GetCartRequestBodySchema = EmptyRequestBodySchema;
export type GetCartRequestBodyDTO = z.infer<typeof GetCartRequestBodySchema>;

export const GetCartRequestQueryParamsSchema = EmptyRequestQueryParamsSchema;
export type GetCartRequestQueryParamsDTO = z.infer<
  typeof GetCartRequestQueryParamsSchema
>;

export const GetCartRequestPathParamsSchema = z.object({
  userId: z.string(),
});
export type GetCartRequestPathParamsDTO = z.infer<
  typeof GetCartRequestPathParamsSchema
>;

export const GetCartResponseBodySchema = z.object({
  message: z.string().optional(),
  data: z.object({
    items: z.array(CartItemSchema),
  }),
});
export type GetCartResponseBodyDTO = z.infer<typeof GetCartResponseBodySchema>;

export const SyncCartRequestBodySchema = z.object({
  items: z.array(CartItemSchema),
});
export type SyncCartRequestBodyDTO = z.infer<typeof SyncCartRequestBodySchema>;

export const SyncCartRequestQueryParamsSchema = EmptyRequestQueryParamsSchema;
export type SyncCartRequestQueryParamsDTO = z.infer<
  typeof SyncCartRequestQueryParamsSchema
>;

export const SyncCartRequestPathParamsSchema = EmptyRequestPathParamsSchema;
export type SyncCartRequestPathParamsDTO = z.infer<
  typeof SyncCartRequestPathParamsSchema
>;

export const SyncCartResponseBodySchema = z.object({
  success: z.boolean(),
});
export type SyncCartResponseBodyDTO = z.infer<
  typeof SyncCartResponseBodySchema
>;

export const AddItemToCartRequestBodySchema = z.object({
  dishId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string(),
  description: z.string(),
});
export type AddItemToCartRequestBodyDTO = z.infer<
  typeof AddItemToCartRequestBodySchema
>;

export const AddItemToCartRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type AddItemToCartRequestQueryParamsDTO = z.infer<
  typeof AddItemToCartRequestQueryParamsSchema
>;

export const AddItemToCartRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type AddItemToCartRequestPathParamsDTO = z.infer<
  typeof AddItemToCartRequestPathParamsSchema
>;

export const AddItemToCartResponseBodySchema = z.object({
  success: z.boolean(),
});
export type AddItemToCartResponseBodyDTO = z.infer<
  typeof AddItemToCartResponseBodySchema
>;

export const UpdateCartItemQuantityRequestBodySchema = z.object({
  dishId: z.string(),
  quantity: z.number(),
});
export type UpdateCartItemQuantityRequestBodyDTO = z.infer<
  typeof UpdateCartItemQuantityRequestBodySchema
>;

export const UpdateCartItemQuantityRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type UpdateCartItemQuantityRequestQueryParamsDTO = z.infer<
  typeof UpdateCartItemQuantityRequestQueryParamsSchema
>;

export const UpdateCartItemQuantityRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type UpdateCartItemQuantityRequestPathParamsDTO = z.infer<
  typeof UpdateCartItemQuantityRequestPathParamsSchema
>;

export const UpdateCartItemQuantityResponseBodySchema = z.object({
  success: z.boolean(),
});
export type UpdateCartItemQuantityResponseBodyDTO = z.infer<
  typeof UpdateCartItemQuantityResponseBodySchema
>;

export const RemoveItemFromCartRequestBodySchema = EmptyRequestBodySchema;
export type RemoveItemFromCartRequestBodyDTO = z.infer<
  typeof RemoveItemFromCartRequestBodySchema
>;

export const RemoveItemFromCartRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type RemoveItemFromCartRequestQueryParamsDTO = z.infer<
  typeof RemoveItemFromCartRequestQueryParamsSchema
>;

export const RemoveItemFromCartRequestPathParamsSchema = z.object({
  dishId: z.string(),
});
export type RemoveItemFromCartRequestPathParamsDTO = z.infer<
  typeof RemoveItemFromCartRequestPathParamsSchema
>;

export const RemoveItemFromCartResponseBodySchema = z.object({
  success: z.boolean(),
});
export type RemoveItemFromCartResponseBodyDTO = z.infer<
  typeof RemoveItemFromCartResponseBodySchema
>;

export const ClearCartRequestBodySchema = EmptyRequestBodySchema;
export type ClearCartRequestBodyDTO = z.infer<
  typeof ClearCartRequestBodySchema
>;

export const ClearCartRequestQueryParamsSchema = EmptyRequestQueryParamsSchema;
export type ClearCartRequestQueryParamsDTO = z.infer<
  typeof ClearCartRequestQueryParamsSchema
>;

export const ClearCartRequestPathParamsSchema = EmptyRequestPathParamsSchema;
export type ClearCartRequestPathParamsDTO = z.infer<
  typeof ClearCartRequestPathParamsSchema
>;

export const ClearCartResponseBodySchema = z.object({
  success: z.boolean(),
});
export type ClearCartResponseBodyDTO = z.infer<
  typeof ClearCartResponseBodySchema
>;
