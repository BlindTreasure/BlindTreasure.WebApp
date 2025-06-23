"use client";

import { useEffect } from "react";
import { getStorageItem, setStorageItem, removeStorageItem } from "@/utils/local-storage";
import { refreshToken } from "@/services/auth/api-services";
import { useRouter } from "next/navigation";

const REFRESH_INTERVAL = 10 * 60 * 1000;
export default function useAutoRefreshToken() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentRefreshToken = getStorageItem("refreshToken");
      if (!currentRefreshToken) return;

      try {
        const res = await refreshToken({ refreshToken: currentRefreshToken });
        const newAccessToken = res?.value?.data?.accessToken;
        const newRefreshToken = res?.value?.data?.refreshToken;

        if (newAccessToken && newRefreshToken) {
          setStorageItem("accessToken", newAccessToken);
          setStorageItem("refreshToken", newRefreshToken);
        } else {
          throw new Error("Invalid refresh response");
        }
      } catch (error) {
        removeStorageItem("accessToken");
        removeStorageItem("refreshToken");
        router.push("/login");
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [router]);
}
