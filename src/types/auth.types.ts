import { IUser } from "./user.types";

export type CheckEmailResponseBodyDTO = {
  firstName: string;
  lastName: string;
  email: string;
  token?: string;
};

export type CheckEmailRequestBodyDTO = {
  email: string;
};

export type LoginRequestBodyDTO = {
  email: string;
  password: string;
};

export type LoginResponseBodyDTO = {
  user: IUser;
};

export type SignupRequestBodyDTO = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
};

export type SignupResponseBodyDTO = {
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
