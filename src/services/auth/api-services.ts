import request from "@/components/interceptor";
import API_ENDPOINTS from "@/services/auth/api-path";
import { getStorageItem } from "@/utils/local-storage";
import {
  LoginBodyType,
  RegisterBodyType,
  RegisterBodyWithoutConfirm,
  RegisterSellerBodyWithoutConfirm,
} from "@/utils/schema-validations/auth.schema";

export const login = async (body: LoginBodyType) => {
  const response = await request<TResponseData<API.TAuthResponse>>(API_ENDPOINTS.LOGIN, {
    method: "POST",
    data: body,
  });
  return response.data;
};

export const register = async (body: RegisterBodyWithoutConfirm): Promise<TResponseData<API.TRegisterResponse>> => {
  const response = await request<TResponseData<API.TRegisterResponse>>(API_ENDPOINTS.REGISTER, {
    method: "POST",
    data: body,
  });
  return response.data;
};

export const registerSeller = async (body: RegisterSellerBodyWithoutConfirm): Promise<TResponseData<API.TRegisterSellerResponse>> => {
  const response = await request<TResponseData<API.TRegisterSellerResponse>>(API_ENDPOINTS.REGISTER_SELLER, {
    method: "POST",
    data: body,
  });
  return response.data;
};

export const verifyOtp = async (body: API.TAuthVerifyOtp) => {
  const response = await request<TResponseData>(
    API_ENDPOINTS.VERIFY_OTP,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const logout = async () => {
  const response = await request<TResponseData>(API_ENDPOINTS.LOGOUT, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${getStorageItem("accessToken")}`
    }
  });
  return response.data;
};


export const forgotPasswordEmail = async (
  body: API.TAuthForgotPasswordEmail
) => {
  const response = await request<TResponseData>(
    API_ENDPOINTS.FORGOT_PASSWORD_EMAIL,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const resendOtp = async (body: FormData) => {
  const response = await request<TResponseData>(API_ENDPOINTS.RESEND_OTP, {
    method: "POST",
    data: body,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const forgotPasswordChange = async (
  body: API.TAuthForgotPasswordChange
) => {
  const response = await request<TResponseData>(
    API_ENDPOINTS.FORGOT_PASSWORD_CHANGE,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const refreshToken = async (body: API.TAuthRefreshToken) => {
  const response = await request<TResponseData<API.TRefreshTokenResponse>>(API_ENDPOINTS.REFRESH_TOKEN, {
    method: "POST",
    data: body,
  });
  return response.data;
};

export const loginGoogle = async (body: API.TAuthLoginGoogle) => {
  const response = await request<API.TAuthResponse>(
    API_ENDPOINTS.LOGIN_GOOGLE,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};
