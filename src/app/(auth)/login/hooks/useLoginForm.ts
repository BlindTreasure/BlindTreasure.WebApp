"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useServiceLogin } from "@/services/auth/services";
import { useRouter } from "next/navigation";
import {
  LoginBody,
  LoginBodyType,
} from "@/utils/schema-validations/auth.schema";
import { jwtDecode } from "jwt-decode";
import useToast from "@/hooks/use-toast";
import { useAppDispatch } from "@/stores/store";
import { setUser } from "@/stores/user-slice";
import { handleError } from "@/hooks/error";

export function useLoginForm() {
  const router = useRouter();
  const [typePassword, setTypePassword] = useState<boolean>(false);
  const { mutate, isPending } = useServiceLogin();
  const { addToast } = useToast();
  const dispatch = useAppDispatch();

  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (request: LoginBodyType) => {
    try {
      mutate(request, {
        onSuccess: async (data) => {
          if (data?.isSuccess) {
            reset();
            const userInfo = data.value?.data?.user;
            if (userInfo) {
              dispatch(
                setUser({
                  email: userInfo.email,
                  avatarUrl: userInfo.avatarUrl,
                  fullName: userInfo.fullName,
                  roleName: userInfo.roleName,
                })
              );

              const roleName = userInfo.roleName;

              switch (roleName) {
                case "Admin":
                  return router.push("/admin/dashboard");
                case "Staff":
                  return router.push("/");
                case "Seller":
                  return router.push("/seller/dashboard");
                case "Customer":
                default:
                  return router.push("/");
              }
            } else {
              return router.push("/login");
            }
          }
        },
        onError: (error: any) => {
          handleError(error);
        },
      });
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const valuePassword = watch("password");

  const handleToggleTypePassword = () => {
    setTypePassword((prev) => !prev);
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isPending,
    valuePassword,
    typePassword,
    handleToggleTypePassword,
  };
}
