import { z } from "zod";
import {
  EmptyRequestBodySchema,
  EmptyRequestPathParamsSchema,
} from "./common.dto";
import { CategorySchema } from "./model.schemas";

export const GetCategoriesRequestBodySchema = EmptyRequestBodySchema;
export type GetCategoriesRequestBodyDTO = z.infer<
  typeof GetCategoriesRequestBodySchema
>;

export const GetCategoriesRequestQueryParamsSchema = z.object({
  restaurant: z.string(),
});
export type GetCategoriesRequestQueryParamsDTO = z.infer<
  typeof GetCategoriesRequestQueryParamsSchema
>;

export const GetCategoriesRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type GetCategoriesRequestPathParamsDTO = z.infer<
  typeof GetCategoriesRequestPathParamsSchema
>;

export const GetCategoriesResponseBodySchema = z.object({
  data: z.array(CategorySchema),
});
export type GetCategoriesResponseBodyDTO = z.infer<
  typeof GetCategoriesResponseBodySchema
>;
