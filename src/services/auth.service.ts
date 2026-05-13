import axios, { isAxiosError } from "axios";
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
  successResponse?: LoginResponseBodyDTO & {
    accessToken?: string;
    refreshToken?: string;
  };
};

export const login = async (
  body: LoginRequestBodyDTO,
): Promise<ILoginResponse> => {
  try {
    const response = await axios.post<
      | CommonResponseDTO<{
          accessToken: string;
          refreshToken?: string;
          user?: LoginApiResponseBodyDTO["user"];
        }>
      | LoginApiResponseBodyDTO
    >("/api/auth/login", body);

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
    if (!getStoredAccessToken()) {
      return false;
    }

    const response = await axios.get("/api/auth/me", {
      headers: getAuthHeader(),
    });

    const user = response.data?.data ?? response.data?.user;
    if (user) {
      return { valid: true, user };
    }
    return false;
  } catch (error) {
    console.error("Error checking auth status", error);
    return false;
  }
};

export const refreshToken = async () => {
  try {
    const storedRefreshToken = getStoredRefreshToken();
    if (!storedRefreshToken) {
      return {
        status: false,
        accessToken: undefined,
        refreshToken: undefined,
      };
    }

    const response = await axios.post("/api/auth/refresh", {
      refreshToken: storedRefreshToken,
    });
    const payload = response.data?.data ?? response.data;

    return {
      status: response.status === 200,
      accessToken: payload?.accessToken,
      refreshToken: payload?.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing token", error);
    return {
      status: false,
      accessToken: undefined,
      refreshToken: undefined,
    };
  }
};

export const logout = async () => {
  try {
    const storedRefreshToken = getStoredRefreshToken();
    const response = await axios.post("/api/auth/logout", {
      refreshToken: storedRefreshToken,
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error logging out", error);
    return false;
  }
};
