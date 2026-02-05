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
import { showErrorSnackbar } from "../utils/notifications";

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

    showErrorSnackbar("Something went wrong");
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

    showErrorSnackbar("Something went wrong");
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
    role: "user" | "platform_admin" | "restaurant_admin";
    createdAt: string;
    updatedAt: string;
    orderCount: number;
    status: "Active" | "Suspended";
  };
  accessToken: string;
}

export const login = async (
  body: LoginRequestBodyDTO,
): Promise<ILoginResponse> => {
  try {
    const response = await axios.post<LoginApiResponse>(
      "/api/auth/login",
      body,
    );

    if (response.data) {
      const { user } = response.data;

      return {
        type: "SUCCESS",
        successResponse: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone ?? "",
            role: user.role,
            orderCount: user.orderCount ?? 0,
            status: user.status,
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
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        return {
          type: "INVALID",
        };
      }
    }

    showErrorSnackbar("Something went wrong");
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
  } catch {
    showErrorSnackbar("Something went wrong");
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
    if (response.data?.valid === true && response.data?.user !== null) {
      return response.data;
    }
    return false;
  } catch {
    return false;
  }
};

// Prevent multiple simultaneous refresh requests
let refreshPromise: Promise<boolean> | null = null;

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      "/api/auth/refresh",
      {},
      { withCredentials: true },
    );
    return response.status === 200;
  } catch {
    return false;
  }
};

// Get valid auth with automatic refresh on race condition
export const getValidAuth = async () => {
  let result = await checkAuthStatus();
  if (!result) {
    // If a refresh is already in progress, wait for it
    if (!refreshPromise) {
      refreshPromise = refreshToken().finally(() => {
        refreshPromise = null;
      });
    }
    await refreshPromise;
    result = await checkAuthStatus();
  }
  return result;
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
