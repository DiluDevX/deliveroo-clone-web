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
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
  email: string;
}
type ICheckEmailResponse = {
  token?: string;
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
      token: response.data.data.token,
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
    const response = await axios.post<CommonResponseDTO<{ token: string }>>(
      "/api/auth/login",
      body,
    );

    if (response.status === 200 && response.data.data.token) {
      // Decode JWT to extract user info
      const decodedToken: DecodedToken = jwtDecode(response.data.data.token);

      return {
        type: "SUCCESS",
        successResponse: {
          token: response.data.data.token,
          user: {
            email: decodedToken.email,
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName,
            phone: decodedToken.phone,
            role: decodedToken.role,
          },
        },
      };
    }

    return {
      type: "UNKNOWN",
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

export const validateToken = async ({ token }: { token: string }) => {
  try {
    const response = await axios.post("/api/auth/validate-token", { token });
    if (!response.data?.data) {
      return false;
    }
    return response.data.data;
  } catch (error) {
    console.error("Error validating token", error);
    return false;
  }
};
