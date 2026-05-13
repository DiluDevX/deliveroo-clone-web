import { z } from "zod";

export const EmptyRequestBodySchema = z.object({});
export type EmptyRequestBodyDTO = z.infer<typeof EmptyRequestBodySchema>;

export const EmptyRequestQueryParamsSchema = z.object({});
export type EmptyRequestQueryParamsDTO = z.infer<
  typeof EmptyRequestQueryParamsSchema
>;

export const EmptyRequestPathParamsSchema = z.object({});
export type EmptyRequestPathParamsDTO = z.infer<
  typeof EmptyRequestPathParamsSchema
>;

export const EmptyResponseBodySchema = z.object({});
export type EmptyResponseBodyDTO = z.infer<typeof EmptyResponseBodySchema>;
