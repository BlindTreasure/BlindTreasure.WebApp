"use client";

import {
  RegisterBody,
  RegisterBodyType,
  RegisterBodyWithoutConfirm,
} from "@/utils/schema-validations/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  useServiceRegister,
  useServiceResendOtp,
} from "@/services/auth/services";
import { useRouter } from "next/navigation";
import useToast from "@/hooks/use-toast";
import { useAppDispatch } from "@/stores/store";
import { setSignupEmail } from "@/stores/auth-slice";
import { handleError } from "@/hooks/error";

export function useRegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [typePassword, setTypePassword] = useState<boolean>(false);
  const [typeConfirmPassword, setTypeConfirmPassword] =
    useState<boolean>(false);
  const { mutate, isPending } = useServiceRegister();

  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      dateOfBirth: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: RegisterBodyType) => {
    const { confirmPassword, ...rest } = data;

    if (!rest.phoneNumber.startsWith("0")) {
      rest.phoneNumber = `0${rest.phoneNumber}`;
    }

    if (rest.dateOfBirth) {
      rest.dateOfBirth =
        new Date(rest.dateOfBirth).toISOString().split(".")[0] + "Z";
    }

    const dataToSend: RegisterBodyWithoutConfirm = rest;

    try {
      mutate(dataToSend, {
        onSuccess: async (data) => {
          if (data && data.value.code.includes("200")) {
            reset();
            const email = data.value.data?.email || rest.email;

            dispatch(setSignupEmail({ email, otp: "" }));

            router.push(`/signup-otp?email=${encodeURIComponent(email)}`);
          }
        },
        onError: (error: any) => {
          const errorCode = error?.error?.code;
          const errorMessage = error?.error?.message;
          const email = rest.email;

          handleError(error);

          if (
            errorCode === "409" &&
            errorMessage === "Email đã được sử dụng."
          ) {
            dispatch(setSignupEmail({ email, otp: "" }));
            setTimeout(() => {
              router.push(`/signup-otp?email=${encodeURIComponent(email)}`);
            }, 1500);
          }
        },
      });
    } catch (err) {
    }
  };

  const valuePassword = watch("password");
  const valueConfirmPassword = watch("confirmPassword");

  const handleToggleTypePassword = () => {
    setTypePassword((prev) => !prev);
  };

  const handleToggleConfirmPassword = () => {
    setTypeConfirmPassword((prev) => !prev);
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isPending,
    valuePassword,
    typePassword,
    valueConfirmPassword,
    typeConfirmPassword,
    handleToggleTypePassword,
    handleToggleConfirmPassword,
  };
}
