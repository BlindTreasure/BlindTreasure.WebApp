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

type TDecodedToken = {
  role: string;
  email: string;
  cropAvatarLink?: string;
  nameid: string;
};

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
            const token = data.value?.data?.accessToken;
            if (token) {
              const decoded = jwtDecode<TDecodedToken>(token);
              dispatch(
                setUser({
                  role: decoded.role,
                  email: decoded.email,
                  cropAvatarLink: decoded.cropAvatarLink,
                  nameid: decoded.nameid,
                })
              );
              const role = decoded.role;

              switch (role) {
                case "Admin":
                  return router.push("/admin/dashboard");
                case "Staff":
                  return router.push("/");
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
          const data = error?.response?.data || error;
          if (data?.error?.code === "404") {
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
