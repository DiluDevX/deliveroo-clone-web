import axios, { isAxiosError } from "axios";
import {
  CheckEmailRequestBodyDTO,
  CheckEmailResponseBodyDTO,
  EmailOrPhoneRequestBodyDTO,
  EmailOrPhoneResponseBodyDTO,
  LoginRequestBodyDTO,
  LoginResponseBodyDTO,
  SignupRequestBodyDTO,
  SignupResponseBodyDTO,
} from "../types/auth.types";
import { CommonResponseDTO } from "../types/common";

type ICheckEmailResponse = {
  type: "NEW" | "EXISTING" | "UNKNOWN";
  existingUser?: CheckEmailResponseBodyDTO;
};
export const checkEmail = async (
  body: CheckEmailRequestBodyDTO,
): Promise<ICheckEmailResponse> => {
  try {
    const response = await axios.post<
      CommonResponseDTO<CheckEmailResponseBodyDTO>
    >("/api/auth/check-email", body);

    return {
      type: "EXISTING",
      existingUser: response.data.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return {
        type: "NEW",
      };
    }

    console.error("checkEmail", error);
    return {
      type: "UNKNOWN",
    };
  }
};

type IEmailOrPhoneResponse = {
  type: "NEW" | "EXISTING" | "UNKNOWN";
  existingUser?: CheckEmailResponseBodyDTO;
};
export const checkEmailOrPhone = async (
  body: EmailOrPhoneRequestBodyDTO,
): Promise<IEmailOrPhoneResponse> => {
  try {
    console.log(body);
    const response = await axios.post<
      CommonResponseDTO<EmailOrPhoneResponseBodyDTO>
    >("/api/auth/check-email-or-password", body);

    return {
      type: "EXISTING",
      existingUser: response.data.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return {
        type: "NEW",
      };
    }

    console.error("checkEmail", error);
    return {
      type: "UNKNOWN",
    };
  }
};

type ILoginResponse = {
  type: "SUCCESS" | "INVALID" | "UNKNOWN";
  successResponse?: LoginResponseBodyDTO;
};
export const login = async (
  body: LoginRequestBodyDTO,
): Promise<ILoginResponse> => {
  try {
    const response = await axios.post<CommonResponseDTO<LoginResponseBodyDTO>>(
      "/api/auth/login",
      body,
    );

    return {
      type: "SUCCESS",
      successResponse: response.data.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        type: "INVALID",
      };
    }

    console.error("login", error);
    return {
      type: "UNKNOWN",
    };
  }
};

type ISignupResponse = {
  type: "SUCCESS" | "CONFLICT" | "UNKNOWN";
  successResponse?: SignupResponseBodyDTO;
};
export const signup = async (
  body: SignupRequestBodyDTO,
): Promise<ISignupResponse> => {
  try {
    const response = await axios.post<CommonResponseDTO<SignupResponseBodyDTO>>(
      "/api/auth/signup",
      body,
    );

    return {
      type: "SUCCESS",
      successResponse: response.data.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 403) {
      return {
        type: "CONFLICT",
      };
    }

    console.error("login", error);
    return {
      type: "UNKNOWN",
    };
  }
};
