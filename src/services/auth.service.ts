import { isAxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
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
import { IUser } from "../types/user.types";
import apiClient from "./api.client";
import {
  getAuthHeader,
  getStoredAccessToken,
  getStoredRefreshToken,
} from "./auth-headers";

type AccessTokenPayload = {
  userId?: string;
  email?: string;
  role?: "user" | "platform_admin" | "restaurant_admin";
};

type ICheckEmailResponse = {
  token?: string;
  type: "NEW" | "EXISTING" | "UNKNOWN";
  existingUser?: CheckEmailResponseBodyDTO;
};

type AuthStatus = false | { valid: true; user: IUser };
export const checkEmail = async (
  body: CheckEmailRequestBodyDTO,
): Promise<ICheckEmailResponse> => {
  try {
    const response = await apiClient.post<CheckEmailResponseBodyDTO>(
      "/auth/check-email",
      body,
    );

    return {
      type: "EXISTING",
      existingUser: response.data,
      token: response.data.token,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return {
        type: "NEW",
      };
    }

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
    const response = await apiClient.post<
      CommonResponseDTO<EmailOrPhoneResponseBodyDTO>
    >("/auth/check-email", body);

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

    return {
      type: "UNKNOWN",
    };
  }
};

type ILoginResponse = {
  type: "SUCCESS" | "INVALID" | "UNKNOWN";
  successResponse?: LoginResponseBodyDTO & {
    accessToken?: string;
    refreshToken?: string;
  };
};

type LoginPayload = LoginApiResponseBodyDTO & {
  refreshToken?: string;
};

type LoginApiResponse = CommonResponseDTO<LoginPayload> | LoginPayload;

export const login = async (
  body: LoginRequestBodyDTO,
): Promise<ILoginResponse> => {
  try {
    const response = await apiClient.post<LoginApiResponse>(
      "/auth/login",
      body,
    );

    if (response.data) {
      const payload =
        "data" in response.data ? response.data.data : response.data;
      const accessToken = payload.accessToken;
      const refreshToken =
        "refreshToken" in payload ? payload.refreshToken : undefined;

      if (!accessToken) {
        return {
          type: "UNKNOWN",
        };
      }

      try {
        const decoded = jwtDecode<AccessTokenPayload>(accessToken);

        const user = payload.user ?? {
          id: decoded.userId || "",
          email: decoded.email || body.email,
          firstName: "",
          lastName: "",
          phone: undefined,
          role: decoded.role || "user",
          status: "Active" as const,
          orderCount: 0,
          createdAt: "",
          updatedAt: "",
        };

        return {
          type: "SUCCESS",
          successResponse: {
            accessToken,
            refreshToken,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone ?? undefined,
              role: user.role,
              restaurantId: user.restaurantId ?? undefined,
              status: "Active",
              orderCount: 0,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            },
          },
        };
      } catch (error) {
        console.error("Error decoding access token:", error);
        return {
          type: "INVALID",
        };
      }
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
    const response = await apiClient.post<SignupResponseBodyDTO>(
      "/auth/signup",
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
    const response = await apiClient.post("/auth/reset-password", {
      token,
      password,
    });
    if (response.status !== 200) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const checkAuthStatus = async (): Promise<AuthStatus> => {
  if (!getStoredAccessToken()) {
    return false;
  }

  try {
    const response = await apiClient.get("/auth/me", {
      headers: getAuthHeader(),
    });
    const user = response.data?.data ?? response.data?.user;

    if (user) {
      return { valid: true, user };
    }

    return false;
  } catch {
    return false;
  }
};

export const refreshToken = async () => {
  const storedRefreshToken = getStoredRefreshToken();
  if (!storedRefreshToken) {
    return false;
  }

  try {
    const response = await apiClient.post("/auth/refresh", {
      refreshToken: storedRefreshToken,
    });

    return response.status === 200;
  } catch (error) {
    console.error("Error refreshing token", error);
    return false;
  }
};

export const logout = async () => {
  const storedRefreshToken = getStoredRefreshToken();

  try {
    const response = await apiClient.post("/auth/logout", {
      refreshToken: storedRefreshToken,
    });

    return response.status === 200;
  } catch {
    return false;
  }
};

export const getValidAdminAuth = async (): Promise<AuthStatus> => {
  const authStatus = await checkAuthStatus();

  if (
    authStatus &&
    typeof authStatus !== "boolean" &&
    (authStatus.user?.role === "platform_admin" ||
      authStatus.user?.role === "restaurant_admin")
  ) {
    return authStatus;
  }

  return false;
};
