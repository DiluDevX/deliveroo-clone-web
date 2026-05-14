import { z } from "zod";
import {
  EmptyRequestBodySchema,
  EmptyRequestPathParamsSchema,
  EmptyRequestQueryParamsSchema,
} from "./common.dto";
import { FinanceRecordSchema } from "./model.schemas";

export const GetAdminDashboardStatsRequestBodySchema = EmptyRequestBodySchema;
export type GetAdminDashboardStatsRequestBodyDTO = z.infer<
  typeof GetAdminDashboardStatsRequestBodySchema
>;

export const GetAdminDashboardStatsRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type GetAdminDashboardStatsRequestQueryParamsDTO = z.infer<
  typeof GetAdminDashboardStatsRequestQueryParamsSchema
>;

export const GetAdminDashboardStatsRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type GetAdminDashboardStatsRequestPathParamsDTO = z.infer<
  typeof GetAdminDashboardStatsRequestPathParamsSchema
>;

export const GetAdminDashboardStatsResponseBodySchema = z.object({
  data: z.object({
    stats: z.object({
      totalPlatformRevenue: z.number(),
    }),
  }),
});
export type GetAdminDashboardStatsResponseBodyDTO = z.infer<
  typeof GetAdminDashboardStatsResponseBodySchema
>;

export const GetFinanceRecordsRequestBodySchema = EmptyRequestBodySchema;
export type GetFinanceRecordsRequestBodyDTO = z.infer<
  typeof GetFinanceRecordsRequestBodySchema
>;

export const GetFinanceRecordsRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type GetFinanceRecordsRequestQueryParamsDTO = z.infer<
  typeof GetFinanceRecordsRequestQueryParamsSchema
>;

export const GetFinanceRecordsRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type GetFinanceRecordsRequestPathParamsDTO = z.infer<
  typeof GetFinanceRecordsRequestPathParamsSchema
>;

export const GetFinanceRecordsResponseBodySchema = z.object({
  data: z.array(FinanceRecordSchema),
});
export type GetFinanceRecordsResponseBodyDTO = z.infer<
  typeof GetFinanceRecordsResponseBodySchema
>;
