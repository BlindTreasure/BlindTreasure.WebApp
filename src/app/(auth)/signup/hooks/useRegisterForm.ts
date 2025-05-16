"use client";

import {
  RegisterBody,
  RegisterBodyType,
  RegisterBodyWithoutConfirm,
} from "@/utils/schema-validations/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useServiceRegister } from "@/services/auth/services";
import { useRouter } from "next/navigation";
import useToast from "@/hooks/use-toast";
import { useAppDispatch } from "@/stores/store";
import { setSignupEmail } from "@/stores/auth-slice";

export function useRegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [typePassword, setTypePassword] = useState<boolean>(false);
  const [typeConfirmPassword, setTypeConfirmPassword] =
    useState<boolean>(false);
  const { mutate, isPending } = useServiceRegister();
  const { addToast } = useToast();

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

    if (rest.dateOfBirth) {
      rest.dateOfBirth =
        new Date(rest.dateOfBirth).toISOString().split(".")[0] + "Z";
    }

    const dataToSend: RegisterBodyWithoutConfirm = rest;

    try {
      mutate(dataToSend, {
        onSuccess: async (data) => {
          console.log("DATA ON SUCCESS:", data);
          if (data && data.value.code.includes("200")) {
            addToast({
              description: data.value.message,
              type: "success",
              duration: 5000,
            });
            reset();
            const email = data.value.data?.email || rest.email;
            dispatch(setSignupEmail({ email, otp: "" }));
            router.push(`/signup-otp?email=${encodeURIComponent(email)}`);
          }
        },
        onError: (error: any) => {
          const data = error?.response?.data || error;
          if (data?.error?.code === "400") {
            setError("email", {
              type: "manual",
              message: data.error.message,
            });

            addToast({
              type: "error",
              description: data.error.message,
              duration: 5000,
            });
          }
        },
      });
    } catch (err) {
      console.log("err: ", err);
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
