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

interface LoginApiResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  // refreshToken is now handled via HttpOnly cookie, not returned to client
}

export const login = async (
  body: LoginRequestBodyDTO,
): Promise<ILoginResponse> => {
  try {
    const response = await axios.post<LoginApiResponse>(
      "/api/auth/login",
      body,
    );

    if (response.data.accessToken) {
      const { user } = response.data;

      // The refresh token is now set by the server in an HttpOnly, Secure, SameSite cookie.

      return {
        type: "SUCCESS",
        successResponse: {
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone ?? undefined,
            role: user.role,
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

    // The refresh token is now set by the server in an HttpOnly, Secure, SameSite cookie.
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
  email,
  password,
}: {
  token: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post("/api/auth/reset-password", {
      token,
      email,
      password,
    });
    if (!response.data?.data) {
      return false;
    }
    return response.data.message;
  } catch (error) {
    console.error("Error validating token", error);
    return false;
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get("/api/auth/me", { withCredentials: true });
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
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch (error) {
    console.error("Error refreshing token", error);
    return false;
  }
};
