import { z } from "zod";
import {
  EmptyRequestBodySchema,
  EmptyRequestPathParamsSchema,
  EmptyRequestQueryParamsSchema,
} from "./common.dto";
import { RestaurantSchema } from "./model.schemas";

export const GetAllRestaurantsRequestBodySchema = EmptyRequestBodySchema;
export type GetAllRestaurantsRequestBodyDTO = z.infer<
  typeof GetAllRestaurantsRequestBodySchema
>;

export const GetAllRestaurantsRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type GetAllRestaurantsRequestQueryParamsDTO = z.infer<
  typeof GetAllRestaurantsRequestQueryParamsSchema
>;

export const GetAllRestaurantsRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type GetAllRestaurantsRequestPathParamsDTO = z.infer<
  typeof GetAllRestaurantsRequestPathParamsSchema
>;

export const GetAllRestaurantsResponseBodySchema = z.object({
  data: z.array(RestaurantSchema),
});
export type GetAllRestaurantsResponseBodyDTO = z.infer<
  typeof GetAllRestaurantsResponseBodySchema
>;

export const GetFilteredRestaurantsRequestBodySchema = EmptyRequestBodySchema;
export type GetFilteredRestaurantsRequestBodyDTO = z.infer<
  typeof GetFilteredRestaurantsRequestBodySchema
>;

export const GetFilteredRestaurantsRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type GetFilteredRestaurantsRequestQueryParamsDTO = z.infer<
  typeof GetFilteredRestaurantsRequestQueryParamsSchema
>;

export const GetFilteredRestaurantsRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type GetFilteredRestaurantsRequestPathParamsDTO = z.infer<
  typeof GetFilteredRestaurantsRequestPathParamsSchema
>;

export const GetFilteredRestaurantsResponseBodySchema = z.object({
  data: z.array(RestaurantSchema),
});
export type GetFilteredRestaurantsResponseBodyDTO = z.infer<
  typeof GetFilteredRestaurantsResponseBodySchema
>;

export const GetSingleRestaurantRequestBodySchema = EmptyRequestBodySchema;
export type GetSingleRestaurantRequestBodyDTO = z.infer<
  typeof GetSingleRestaurantRequestBodySchema
>;

export const GetSingleRestaurantRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type GetSingleRestaurantRequestQueryParamsDTO = z.infer<
  typeof GetSingleRestaurantRequestQueryParamsSchema
>;

export const GetSingleRestaurantRequestPathParamsSchema = z.object({
  restaurantId: z.string(),
});
export type GetSingleRestaurantRequestPathParamsDTO = z.infer<
  typeof GetSingleRestaurantRequestPathParamsSchema
>;

export const GetSingleRestaurantResponseBodySchema = z.object({
  data: RestaurantSchema,
});
export type GetSingleRestaurantResponseBodyDTO = z.infer<
  typeof GetSingleRestaurantResponseBodySchema
>;

export const CreateRestaurantRequestBodySchema = RestaurantSchema.partial();
export type CreateRestaurantRequestBodyDTO = z.infer<
  typeof CreateRestaurantRequestBodySchema
>;

export const CreateRestaurantRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type CreateRestaurantRequestQueryParamsDTO = z.infer<
  typeof CreateRestaurantRequestQueryParamsSchema
>;

export const CreateRestaurantRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type CreateRestaurantRequestPathParamsDTO = z.infer<
  typeof CreateRestaurantRequestPathParamsSchema
>;

export const CreateRestaurantResponseBodySchema = z.object({
  data: RestaurantSchema,
});
export type CreateRestaurantResponseBodyDTO = z.infer<
  typeof CreateRestaurantResponseBodySchema
>;
