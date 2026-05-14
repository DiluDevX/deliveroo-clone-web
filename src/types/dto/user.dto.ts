import { z } from "zod";
import {
  EmptyRequestBodySchema,
  EmptyRequestPathParamsSchema,
  EmptyRequestQueryParamsSchema,
} from "./common.dto";
import { UserSchema } from "./model.schemas";

export const GetAllUsersRequestBodySchema = EmptyRequestBodySchema;
export type GetAllUsersRequestBodyDTO = z.infer<
  typeof GetAllUsersRequestBodySchema
>;

export const GetAllUsersRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type GetAllUsersRequestQueryParamsDTO = z.infer<
  typeof GetAllUsersRequestQueryParamsSchema
>;

export const GetAllUsersRequestPathParamsSchema = EmptyRequestPathParamsSchema;
export type GetAllUsersRequestPathParamsDTO = z.infer<
  typeof GetAllUsersRequestPathParamsSchema
>;

export const GetAllUsersResponseBodySchema = z.object({
  data: z.array(UserSchema),
});
export type GetAllUsersResponseBodyDTO = z.infer<
  typeof GetAllUsersResponseBodySchema
>;
