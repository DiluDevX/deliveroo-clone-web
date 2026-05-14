import { z } from "zod";
import {
  EmptyRequestBodySchema,
  EmptyRequestPathParamsSchema,
} from "./common.dto";
import { DishSchema } from "./model.schemas";

export const GetDishesRequestBodySchema = EmptyRequestBodySchema;
export type GetDishesRequestBodyDTO = z.infer<
  typeof GetDishesRequestBodySchema
>;

export const GetDishesRequestQueryParamsSchema = z.object({
  category: z.string(),
});
export type GetDishesRequestQueryParamsDTO = z.infer<
  typeof GetDishesRequestQueryParamsSchema
>;

export const GetDishesRequestPathParamsSchema = EmptyRequestPathParamsSchema;
export type GetDishesRequestPathParamsDTO = z.infer<
  typeof GetDishesRequestPathParamsSchema
>;

export const GetDishesResponseBodySchema = z.object({
  data: z.array(DishSchema),
});
export type GetDishesResponseBodyDTO = z.infer<
  typeof GetDishesResponseBodySchema
>;
