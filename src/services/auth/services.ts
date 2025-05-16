import {
  forgotPasswordChange,
  forgotPasswordEmail,
  forgotPasswordOtp,
  login,
  logout,
  register,
  verifyEmail,
  verifyOtp,
} from "@/services/auth/api-services";
import { useAppDispatch } from "@/stores/store";
import { removeStorageItem, setStorageItem } from "@/utils/local-storage";
import {
  LoginBodyType,
  RegisterBodyType,
  RegisterBodyWithoutConfirm,
} from "@/utils/schema-validations/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordEmailBodyType } from "@/utils/schema-validations/forgot-password.schema";
import useToast from "@/hooks/use-toast";
import { resetProfile } from "@/stores/account-slice";
import { clearUser } from "@/stores/user-slice";

export const useServiceLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation<TResponseData<API.TAuthResponse>, TMeta, LoginBodyType>({
    mutationFn: login,
    onSuccess: (data) => {
      const tokenData = data?.value?.data;
      if (tokenData?.accessToken) {
        setStorageItem("accessToken", `${tokenData.accessToken}`);
        setStorageItem("refreshToken", tokenData.refreshToken);
      }
    },
  });
};

export const useServiceRegister = () => {
  const { addToast } = useToast();
  return useMutation<
    TResponseData<API.TRegisterResponse>,
    TMeta,
    RegisterBodyWithoutConfirm
  >({
    mutationFn: register,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceVerifyEmail = () => {
  const { addToast } = useToast();
  return useMutation<TResponse, TMeta, REQUEST.TAuthVerifyEmail>({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceForgotPasswordEmail = () => {
  const { addToast } = useToast();
  return useMutation<TResponseData, TMeta, ForgotPasswordEmailBodyType>({
    mutationFn: forgotPasswordEmail,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceForgotPasswordOtp = () => {
  const { addToast } = useToast();
  return useMutation<TResponseData, TMeta, API.TAuthForgotPasswordOtp>({
    mutationFn: forgotPasswordOtp,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceVerifyOtp = () => {
  const { addToast } = useToast();
  return useMutation<TResponseData, TMeta, API.TAuthVerifyOtp>({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceForgotPasswordChange = () => {
  const { addToast } = useToast();
  return useMutation<TResponseData, TMeta, API.TAuthForgotPasswordChange>({
    mutationFn: forgotPasswordChange,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceLogout = () => {
  const dispatch = useAppDispatch();
  return useMutation<TResponseData, TMeta>({
    mutationFn: logout,
    onSuccess: (data) => {
      removeStorageItem("accessToken");
      dispatch(clearUser());
      dispatch(resetProfile());
      // dispatch(resetCreatePet());
      dispatch(resetProfile());
      window.location.href = "/";
    },
    onError: (error) => {
      removeStorageItem("accessToken");
      dispatch(clearUser());
      dispatch(resetProfile());
      // dispatch(resetCreatePet());
      dispatch(resetProfile());
      window.location.href = "/";
    },
  });
};
