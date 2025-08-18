"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "@/stores/store";
import { loginGoogle } from "@/services/auth/api-services";
import useToast from "./use-toast";
import { isTMeta } from "@/utils/compare";
import { closeBackdrop, openBackdrop } from "@/stores/state-slice";
import { setStorageItem } from "@/utils/local-storage";
import { loginUser } from "@/stores/user-slice";

export default function useLoginGoogle() {
  const dispatch = useAppDispatch();
  const [isPendingGoogle, setIsPendingGoogle] = useState<boolean>(false);
  const { addToast } = useToast();
  const router = useRouter();

  const exchangeCodeForIdToken = async (code: string) => {
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to exchange code for token");
      }

      if (data.id_token) {
        return data.id_token;
      } else {
        throw new Error("No ID token in response: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
    }
  };

  const handleLoginWithIdToken = async (idToken: string) => {
    setIsPendingGoogle(true);
    dispatch(openBackdrop());

    try {
      const res = await loginGoogle({
        token: idToken,
      });

      const tokenData = res?.value?.data;
      if (tokenData?.accessToken) {
        setStorageItem("accessToken", `${tokenData.accessToken}`);
        setStorageItem("refreshToken", tokenData.refreshToken);
      }

      const cleanUser = {
        ...tokenData.user,
        avatarUrl: tokenData.user.avatarUrl?.replace(/\\\//g, "/") || "",
      };
      dispatch(loginUser(cleanUser));

      addToast({
        description: "Đăng nhập Google thành công!",
        type: "success",
        duration: 3000,
      });

      router.push("/");
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (isTMeta(error)) {
        if (error?.errorCode?.includes("auth_noti")) {
          addToast({
            description: error?.detail,
            type: "error",
            duration: 5000,
          });
        }
        if (error?.errorCode?.includes("auth_regis_another")) {
          addToast({
            description: error?.detail,
            type: "error",
            duration: 5000,
          });
        }
      } else {
        addToast({
          description: "Đăng nhập Google thất bại",
          type: "error",
          duration: 5000,
        });
      }
    } finally {
      setIsPendingGoogle(false);
      dispatch(closeBackdrop());
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const idToken = await exchangeCodeForIdToken(codeResponse.code);

        await handleLoginWithIdToken(idToken);
      } catch (error) {
        console.error("Error in Google login flow:", error);
        addToast({
          description: "Đăng nhập Google thất bại",
          type: "error",
          duration: 5000,
        });
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      addToast({
        description: "Đăng nhập Google thất bại",
        type: "error",
        duration: 5000,
      });
    },
    flow: "auth-code",
    scope: "openid email profile",
  });

  return {
    handleLoginGoogle: googleLogin,
    isPendingGoogle,
  };
}
