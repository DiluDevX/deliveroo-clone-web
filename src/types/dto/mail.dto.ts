import { z } from "zod";
import {
  EmptyRequestPathParamsSchema,
  EmptyRequestQueryParamsSchema,
} from "./common.dto";

export const SendForgotPasswordEmailRequestBodySchema = z.object({
  email: z.string(),
});
export type SendForgotPasswordEmailRequestBodyDTO = z.infer<
  typeof SendForgotPasswordEmailRequestBodySchema
>;

export const SendForgotPasswordEmailRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type SendForgotPasswordEmailRequestQueryParamsDTO = z.infer<
  typeof SendForgotPasswordEmailRequestQueryParamsSchema
>;

export const SendForgotPasswordEmailRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type SendForgotPasswordEmailRequestPathParamsDTO = z.infer<
  typeof SendForgotPasswordEmailRequestPathParamsSchema
>;

export const SendForgotPasswordEmailResponseBodySchema = z.object({
  message: z.string(),
});
export type SendForgotPasswordEmailResponseBodyDTO = z.infer<
  typeof SendForgotPasswordEmailResponseBodySchema
>;
