import {
  forgotPasswordChange,
  forgotPasswordEmail,
  forgotPasswordOtp,
  login,
  logout,
  register,
  verifyEmail,
} from "@/services/auth/api-services";
import { useAppDispatch } from "@/stores/store";
import { loginUser, resetUser } from "@/stores/user-slice";
import { removeStorageItem, setStorageItem } from "@/utils/local-storage";
import {
  LoginBodyType,
  RegisterBodyType,
} from "@/utils/schema-validations/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordEmailBodyType } from "@/utils/schema-validations/forgot-password.schema";
import useToast from "@/hooks/use-toast";
import { resetProfile } from "@/stores/account-slice";
// import { resetCreatePet } from "@/src/stores/create-pet-slice";

export const useServiceLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation<API.TAuthResponse, TMeta, LoginBodyType>({
    mutationFn: login,
    onSuccess: (data) => {
      const { authProfile, token } = data;
      // Save access token in local storage
      setStorageItem("accessToken", `${token.tokenType} ${token.accessToken}`);
      // Save auth profile in redux storage
      dispatch(loginUser(authProfile));
      return data;
    },
  });
};

export const useServiceRegister = () => {
  const { addToast } = useToast();
  return useMutation<TResponse, TMeta, RegisterBodyType>({
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
      dispatch(resetUser());
      dispatch(resetProfile());
      // dispatch(resetCreatePet());
      dispatch(resetProfile());
      window.location.href = "/";
    },
    onError: (error) => {
      removeStorageItem("accessToken");
      dispatch(resetUser());
      dispatch(resetProfile());
      // dispatch(resetCreatePet());
      dispatch(resetProfile());
      window.location.href = "/";
    },
  });
};
