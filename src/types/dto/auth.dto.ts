import { z } from "zod";
import {
  EmptyRequestBodySchema,
  EmptyRequestPathParamsSchema,
  EmptyRequestQueryParamsSchema,
  EmptyResponseBodySchema,
} from "./common.dto";
import { UserSchema } from "./model.schemas";

export const CheckEmailRequestBodySchema = z.object({
  email: z.string(),
});
export type CheckEmailRequestBodyDTO = z.infer<
  typeof CheckEmailRequestBodySchema
>;

export const CheckEmailRequestQueryParamsSchema = EmptyRequestQueryParamsSchema;
export type CheckEmailRequestQueryParamsDTO = z.infer<
  typeof CheckEmailRequestQueryParamsSchema
>;

export const CheckEmailRequestPathParamsSchema = EmptyRequestPathParamsSchema;
export type CheckEmailRequestPathParamsDTO = z.infer<
  typeof CheckEmailRequestPathParamsSchema
>;

export const CheckEmailResponseBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  token: z.string().optional(),
});
export type CheckEmailResponseBodyDTO = z.infer<
  typeof CheckEmailResponseBodySchema
>;

export const CheckEmailOrPhoneRequestBodySchema = z.object({
  emailOrPhone: z.string(),
});
export type CheckEmailOrPhoneRequestBodyDTO = z.infer<
  typeof CheckEmailOrPhoneRequestBodySchema
>;

export const EmailOrPhoneRequestBodySchema = CheckEmailOrPhoneRequestBodySchema;
export type EmailOrPhoneRequestBodyDTO = z.infer<
  typeof EmailOrPhoneRequestBodySchema
>;

export const CheckEmailOrPhoneRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type CheckEmailOrPhoneRequestQueryParamsDTO = z.infer<
  typeof CheckEmailOrPhoneRequestQueryParamsSchema
>;

export const EmailOrPhoneRequestQueryParamsSchema =
  CheckEmailOrPhoneRequestQueryParamsSchema;
export type EmailOrPhoneRequestQueryParamsDTO = z.infer<
  typeof EmailOrPhoneRequestQueryParamsSchema
>;

export const CheckEmailOrPhoneRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type CheckEmailOrPhoneRequestPathParamsDTO = z.infer<
  typeof CheckEmailOrPhoneRequestPathParamsSchema
>;

export const EmailOrPhoneRequestPathParamsSchema =
  CheckEmailOrPhoneRequestPathParamsSchema;
export type EmailOrPhoneRequestPathParamsDTO = z.infer<
  typeof EmailOrPhoneRequestPathParamsSchema
>;

export const CheckEmailOrPhoneResponseBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});
export type CheckEmailOrPhoneResponseBodyDTO = z.infer<
  typeof CheckEmailOrPhoneResponseBodySchema
>;

export const EmailOrPhoneResponseBodySchema =
  CheckEmailOrPhoneResponseBodySchema;
export type EmailOrPhoneResponseBodyDTO = z.infer<
  typeof EmailOrPhoneResponseBodySchema
>;

export const LoginRequestBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});
export type LoginRequestBodyDTO = z.infer<typeof LoginRequestBodySchema>;

export const LoginRequestQueryParamsSchema = EmptyRequestQueryParamsSchema;
export type LoginRequestQueryParamsDTO = z.infer<
  typeof LoginRequestQueryParamsSchema
>;

export const LoginRequestPathParamsSchema = EmptyRequestPathParamsSchema;
export type LoginRequestPathParamsDTO = z.infer<
  typeof LoginRequestPathParamsSchema
>;

export const LoginResponseBodySchema = z.object({
  user: UserSchema,
});
export type LoginResponseBodyDTO = z.infer<typeof LoginResponseBodySchema>;

export const LoginApiResponseBodySchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
});
export type LoginApiResponseBodyDTO = z.infer<
  typeof LoginApiResponseBodySchema
>;

export const SignupRequestBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  password: z.string(),
});
export type SignupRequestBodyDTO = z.infer<typeof SignupRequestBodySchema>;

export const SignupRequestQueryParamsSchema = EmptyRequestQueryParamsSchema;
export type SignupRequestQueryParamsDTO = z.infer<
  typeof SignupRequestQueryParamsSchema
>;

export const SignupRequestPathParamsSchema = EmptyRequestPathParamsSchema;
export type SignupRequestPathParamsDTO = z.infer<
  typeof SignupRequestPathParamsSchema
>;

export const SignupResponseBodySchema = z.object({
  user: UserSchema,
});
export type SignupResponseBodyDTO = z.infer<typeof SignupResponseBodySchema>;

export const ResetPasswordRequestBodySchema = z.object({
  token: z.string(),
  password: z.string(),
});
export type ResetPasswordRequestBodyDTO = z.infer<
  typeof ResetPasswordRequestBodySchema
>;

export const ResetPasswordRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type ResetPasswordRequestQueryParamsDTO = z.infer<
  typeof ResetPasswordRequestQueryParamsSchema
>;

export const ResetPasswordRequestPathParamsSchema =
  EmptyRequestPathParamsSchema;
export type ResetPasswordRequestPathParamsDTO = z.infer<
  typeof ResetPasswordRequestPathParamsSchema
>;

export const ResetPasswordResponseBodySchema = z.object({
  success: z.boolean(),
});
export type ResetPasswordResponseBodyDTO = z.infer<
  typeof ResetPasswordResponseBodySchema
>;

export const MeRequestBodySchema = EmptyRequestBodySchema;
export type MeRequestBodyDTO = z.infer<typeof MeRequestBodySchema>;

export const MeRequestQueryParamsSchema = EmptyRequestQueryParamsSchema;
export type MeRequestQueryParamsDTO = z.infer<
  typeof MeRequestQueryParamsSchema
>;

export const MeRequestPathParamsSchema = EmptyRequestPathParamsSchema;
export type MeRequestPathParamsDTO = z.infer<typeof MeRequestPathParamsSchema>;

export const MeResponseBodySchema = z.object({
  valid: z.boolean(),
  user: UserSchema.nullable(),
});
export type MeResponseBodyDTO = z.infer<typeof MeResponseBodySchema>;

export const RefreshTokenRequestBodySchema = EmptyRequestBodySchema;
export type RefreshTokenRequestBodyDTO = z.infer<
  typeof RefreshTokenRequestBodySchema
>;

export const RefreshTokenRequestQueryParamsSchema =
  EmptyRequestQueryParamsSchema;
export type RefreshTokenRequestQueryParamsDTO = z.infer<
  typeof RefreshTokenRequestQueryParamsSchema
>;

export const RefreshTokenRequestPathParamsSchema = EmptyRequestPathParamsSchema;
export type RefreshTokenRequestPathParamsDTO = z.infer<
  typeof RefreshTokenRequestPathParamsSchema
>;

export const RefreshTokenResponseBodySchema = EmptyResponseBodySchema;
export type RefreshTokenResponseBodyDTO = z.infer<
  typeof RefreshTokenResponseBodySchema
>;

export const LogoutRequestBodySchema = EmptyRequestBodySchema;
export type LogoutRequestBodyDTO = z.infer<typeof LogoutRequestBodySchema>;

export const LogoutRequestQueryParamsSchema = EmptyRequestQueryParamsSchema;
export type LogoutRequestQueryParamsDTO = z.infer<
  typeof LogoutRequestQueryParamsSchema
>;

export const LogoutRequestPathParamsSchema = EmptyRequestPathParamsSchema;
export type LogoutRequestPathParamsDTO = z.infer<
  typeof LogoutRequestPathParamsSchema
>;

export const LogoutResponseBodySchema = EmptyResponseBodySchema;
export type LogoutResponseBodyDTO = z.infer<typeof LogoutResponseBodySchema>;
