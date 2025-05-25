import {
  forgotPasswordChange,
  forgotPasswordEmail,
  login,
  logout,
  refreshToken,
  register,
  registerSeller,
  resendOtp,
  verifyOtp,
} from "@/services/auth/api-services";
import { useAppDispatch } from "@/stores/store";
import { removeStorageItem, setStorageItem } from "@/utils/local-storage";
import {
  LoginBodyType,
  RegisterBodyType,
  RegisterBodyWithoutConfirm,
  RegisterSellerBodyWithoutConfirm,
} from "@/utils/schema-validations/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordEmailBodyType } from "@/utils/schema-validations/forgot-password.schema";
import useToast from "@/hooks/use-toast";
import { resetProfile } from "@/stores/account-slice";
import { clearUser, loginUser } from "@/stores/user-slice";
import { useRouter } from "next/navigation";
import { handleError } from "@/hooks/error";

export const useServiceLogin = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  return useMutation<TResponseData<API.TAuthResponse>, TMeta, LoginBodyType>({
    mutationFn: login,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
      const tokenData = data?.value?.data;
      if (tokenData?.accessToken) {
        setStorageItem("accessToken", `${tokenData.accessToken}`);
        setStorageItem("refreshToken", tokenData.refreshToken);
      }
      dispatch(loginUser(tokenData.user));
      return data;
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

export const useServiceRegisterSeller = () => {
  const { addToast } = useToast();
  return useMutation<
    TResponseData<API.TRegisterSellerResponse>,
    TMeta,
    RegisterSellerBodyWithoutConfirm
  >({
    mutationFn: registerSeller,
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

// export const useServiceResendOtp = () => {
//   const { addToast } = useToast();
//   return useMutation<TResponseData, TMeta, REQUEST.TAuthResendOtp>({
//     mutationFn: resendOtp,
//     onSuccess: (data) => {
//       addToast({
//         type: "success",
//         description: data.value.message,
//         duration: 5000,
//       });
//     },
//   });
// };

export const useServiceResendOtp = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData, Error, REQUEST.TAuthResendOtp>({
    mutationFn: async (data: REQUEST.TAuthResendOtp) => {
      const formData = new FormData();
      formData.append("Email", data.Email);
      formData.append("Type", data.Type);
      return await resendOtp(formData);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useServiceForgotPasswordEmail = () => {
  const { addToast } = useToast();
  return useMutation<TResponse, TMeta, ForgotPasswordEmailBodyType>({
    mutationFn: forgotPasswordEmail,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      addToast({
        type: "error",
        description: error.detail,
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
  const { addToast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();
  return useMutation<TResponseData, TMeta>({
    mutationFn: logout,
    onSuccess: (data) => {
      removeStorageItem("accessToken");
      removeStorageItem("refreshToken");
      dispatch(clearUser());
      dispatch(resetProfile());
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
      router.push("/login");
    },
  });
};

export const useServiceRefreshToken = () => {
  return useMutation<
    TResponseData<API.TAuthResponse>,
    TMeta,
    API.TAuthRefreshToken
  >({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      const tokenData = data?.value?.data;
      if (tokenData?.accessToken) {
        setStorageItem("accessToken", `${tokenData.accessToken}`);
        setStorageItem("refreshToken", tokenData.refreshToken);
      }
    },
  });
};
