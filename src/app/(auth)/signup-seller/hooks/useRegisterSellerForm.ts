"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterSellerStepOne, RegisterSellerStepOneType } from "@/utils/schema-validations/auth.schema";
import { useServiceRegisterSeller } from "@/services/auth/services";
import { useAppDispatch } from "@/stores/store";
import { setSignupEmail } from "@/stores/auth-slice";
import { handleError } from "@/hooks/error";

export function useRegisterSellerForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [typePassword, setTypePassword] = useState(false);
  const [typeConfirmPassword, setTypeConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterSellerStepOneType>({
    resolver: zodResolver(RegisterSellerStepOne),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useServiceRegisterSeller();

  const onSubmit = async (data: RegisterSellerStepOneType) => {
    const { confirmPassword, ...rest } = data;

    try {
      mutate(rest, {
        onSuccess: async (res) => {
          if (res?.value?.code.includes("200")) {
            dispatch(setSignupEmail({ email: rest.email, otp: "" }));
            router.push(`/signup-otp?email=${encodeURIComponent(rest.email)}`);
            reset();
          }
        },
        onError: (error: any) => {
          handleError(error);
        },
      });
    } catch (err) {
      console.error("err: ", err);
    }
  };

  const handleToggleTypePassword = () => setTypePassword((prev) => !prev);
  const handleToggleConfirmPassword = () => setTypeConfirmPassword((prev) => !prev);

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isPending,
    typePassword,
    typeConfirmPassword,
    handleToggleTypePassword,
    handleToggleConfirmPassword,
  };
}
