import { IUser } from "./user.types";

export type CheckEmailResponseBodyDTO = {
  firstName: string;
  lastName: string;
  email: string;
};

export type CheckEmailRequestBodyDTO = {
  email: string;
};

export type LoginRequestBodyDTO = {
  email: string;
  password: string;
};

export type LoginResponseBodyDTO = {
  token: string;
};

export type SignupRequestBodyDTO = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
};

export type SignupResponseBodyDTO = {
  token: string;
  user: IUser;
};

export type EmailOrPhoneResponseBodyDTO = {
  firstName: string;
  lastName: string;
  email: string;
};

export type EmailOrPhoneRequestBodyDTO = {
  emailOrPhone: string;
};
