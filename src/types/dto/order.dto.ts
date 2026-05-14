import { z } from "zod";
import {
  EmptyRequestBodySchema,
  EmptyRequestPathParamsSchema,
  EmptyRequestQueryParamsSchema,
} from "./common.dto";
import { FetchedAllOrdersSchema } from "./model.schemas";

export const GetAllOrdersRequestBodySchema = EmptyRequestBodySchema;
export type GetAllOrdersRequestBodyDTO = z.infer<
  typeof GetAllOrdersRequestBodySchema
>;

export const GetAllOrdersRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type GetAllOrdersRequestQueryParamsDTO = z.infer<
  typeof GetAllOrdersRequestQueryParamsSchema
>;

export const GetAllOrdersRequestPathParamsSchema = EmptyRequestPathParamsSchema;
export type GetAllOrdersRequestPathParamsDTO = z.infer<
  typeof GetAllOrdersRequestPathParamsSchema
>;

export const GetAllOrdersResponseBodySchema = z.object({
  data: z.array(FetchedAllOrdersSchema),
});
export type GetAllOrdersResponseBodyDTO = z.infer<
  typeof GetAllOrdersResponseBodySchema
>;

export const GetTotalRevenueRequestBodySchema = EmptyRequestBodySchema;
export type GetTotalRevenueRequestBodyDTO = z.infer<
  typeof GetTotalRevenueRequestBodySchema
>;

export const GetTotalRevenueRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type GetTotalRevenueRequestQueryParamsDTO = z.infer<
  typeof GetTotalRevenueRequestQueryParamsSchema
>;

export const GetTotalRevenueRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type GetTotalRevenueRequestPathParamsDTO = z.infer<
  typeof GetTotalRevenueRequestPathParamsSchema
>;

export const GetTotalRevenueResponseBodySchema = z.object({
  totalRevenue: z.number(),
});
export type GetTotalRevenueResponseBodyDTO = z.infer<
  typeof GetTotalRevenueResponseBodySchema
>;

export const GetRevenueForMonthRequestBodySchema = EmptyRequestBodySchema;
export type GetRevenueForMonthRequestBodyDTO = z.infer<
  typeof GetRevenueForMonthRequestBodySchema
>;

export const GetRevenueForMonthRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type GetRevenueForMonthRequestQueryParamsDTO = z.infer<
  typeof GetRevenueForMonthRequestQueryParamsSchema
>;

export const GetRevenueForMonthRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type GetRevenueForMonthRequestPathParamsDTO = z.infer<
  typeof GetRevenueForMonthRequestPathParamsSchema
>;

export const GetRevenueForMonthResponseBodySchema = z.object({
  totalRevenue: z.number(),
});
export type GetRevenueForMonthResponseBodyDTO = z.infer<
  typeof GetRevenueForMonthResponseBodySchema
>;

export const GetRevenueForWeekRequestBodySchema = EmptyRequestBodySchema;
export type GetRevenueForWeekRequestBodyDTO = z.infer<
  typeof GetRevenueForWeekRequestBodySchema
>;

export const GetRevenueForWeekRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type GetRevenueForWeekRequestQueryParamsDTO = z.infer<
  typeof GetRevenueForWeekRequestQueryParamsSchema
>;

export const GetRevenueForWeekRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type GetRevenueForWeekRequestPathParamsDTO = z.infer<
  typeof GetRevenueForWeekRequestPathParamsSchema
>;

export const GetRevenueForWeekResponseBodySchema = z.object({
  totalRevenue: z.number(),
});
export type GetRevenueForWeekResponseBodyDTO = z.infer<
  typeof GetRevenueForWeekResponseBodySchema
>;
