import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordChangeBody,
  ForgotPasswordChangeBodyType,
} from "@/utils/schema-validations/forgot-password.schema";
import { useServiceForgotPasswordChange } from "@/services/auth/services";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { resetForgotPassword } from "@/stores/auth-slice";
import useToast from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function useForgotPasswordChange() {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");

  const [typePassword, setTypePassword] = useState<boolean>(false);
  const [typeConfirmPassword, setTypeConfirmPassword] =
    useState<boolean>(false);

  const forgotPasswordState = useAppSelector(
    (state) => state.authSlice.forgotPassword
  );

  const { mutate, isPending } = useServiceForgotPasswordChange();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordChangeBodyType>({
    resolver: zodResolver(ForgotPasswordChangeBody),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const valuePassword = watch("password");
  const valueConfirmPassword = watch("confirmPassword");

  const handleToggleTypePassword = () => {
    setTypePassword((prev) => !prev);
  };

  const handleToggleTypeConfirmPassword = () => {
    setTypeConfirmPassword((prev) => !prev);
  };

  const handleReset = () => {
    dispatch(resetForgotPassword());
    reset();
  };

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    if (value.length === 6) {
      setOtpError("");
    }
  };

  const onSubmit = (data: ForgotPasswordChangeBodyType) => {
    if (otpValue.length !== 6) {
      setOtpError("Vui lòng nhập đủ 6 ký tự OTP");
      return;
    }
    try {
      const form = {
        newPassword: data.password,
        email: forgotPasswordState.email,
        otp: otpValue,
      };
      mutate(form, {
        onSuccess: async (data) => {
          if (data) {
            handleReset();
            router.push("/login");
          }
        },
        onError: (error: any) => {
          const data = error?.response?.data || error;
          if (data?.error?.code === "400") {
            addToast({
              type: "error",
              description: data.error.message,
              duration: 5000,
            });
          }
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isPending,
    typePassword,
    typeConfirmPassword,
    valuePassword,
    valueConfirmPassword,
    handleToggleTypePassword,
    handleToggleTypeConfirmPassword,
    otpValue,
    handleOtpChange,
    otpError,
  };
}
