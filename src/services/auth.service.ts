import axios, { isAxiosError } from "axios";
import {
  CheckEmailRequestBodyDTO,
  CheckEmailResponseBodyDTO,
  EmailOrPhoneRequestBodyDTO,
  EmailOrPhoneResponseBodyDTO,
  LoginApiResponseBodyDTO,
  LoginRequestBodyDTO,
  LoginResponseBodyDTO,
  SignupRequestBodyDTO,
  SignupResponseBodyDTO,
} from "../types/auth.types";
import { CommonResponseDTO } from "../types/common";

type ICheckEmailResponse = {
  token?: string;
  type: "NEW" | "EXISTING" | "UNKNOWN";
  existingUser?: CheckEmailResponseBodyDTO;
};
export const checkEmail = async (
  body: CheckEmailRequestBodyDTO,
): Promise<ICheckEmailResponse> => {
  try {
    const response = await axios.post<CheckEmailResponseBodyDTO>(
      "/api/auth/check-email",
      body,
    );

    return {
      type: "EXISTING",
      existingUser: response.data,
      token: response.data.token,
    };
  } catch (error) {
    console.error("checkEmail error:", error);
    if (isAxiosError(error)) {
      console.error("checkEmail error response:", error.response?.data);
      console.error("checkEmail error status:", error.response?.status);
    }
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
    const response = await axios.post<
      CommonResponseDTO<EmailOrPhoneResponseBodyDTO>
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

type ILoginResponse = {
  type: "SUCCESS" | "INVALID" | "UNKNOWN";
  successResponse?: LoginResponseBodyDTO;
};

export const login = async (
  body: LoginRequestBodyDTO,
): Promise<ILoginResponse> => {
  try {
    const response = await axios.post<LoginApiResponseBodyDTO>(
      "/api/auth/login",
      body,
    );
    console.log("login response", response.data);

    if (response.data) {
      const { user } = response.data;

      // The refresh token and access tokens are now set by the server in an HttpOnly, Secure, SameSite cookie.

      return {
        type: "SUCCESS",
        successResponse: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone ?? undefined,
            role: user.role,
            status: "Active",
            orderCount: 0,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      };
    }

    return {
      type: "UNKNOWN",
    };
  } catch (error) {
    console.error("login error:", error);
    if (isAxiosError(error)) {
      console.error("login error response:", error.response?.data);
      console.error("login error status:", error.response?.status);
      if (error.response?.status === 401) {
        return {
          type: "INVALID",
        };
      }
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
    const response = await axios.post<SignupResponseBodyDTO>(
      "/api/auth/signup",
      body,
    );

    return {
      type: "SUCCESS",
      successResponse: response.data,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 403 || error.response?.status === 409) {
        return {
          type: "CONFLICT",
        };
      }
    }

    return {
      type: "UNKNOWN",
    };
  }
};

export const resetUserPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  try {
    const response = await axios.post("/api/auth/reset-password", {
      token,
      password,
    });
    if (response.status !== 200) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error validating token", error);
    return false;
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await axios.post(
      "/api/auth/me",
      {},
      { withCredentials: true },
    );
    console.log("checkAuthStatus response", response.data);
    if (response.data?.valid === true && response.data?.user !== null) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Error checking auth status", error);
    return false;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      "/api/auth/refresh",
      {},
      { withCredentials: true },
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error refreshing token", error);
    return false;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(
      "/api/auth/logout",
      {},
      { withCredentials: true },
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error logging out", error);
    return false;
  }
};
