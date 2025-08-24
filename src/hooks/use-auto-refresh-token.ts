"use client";

import { useEffect } from "react";
import { getStorageItem, setStorageItem, removeStorageItem } from "@/utils/local-storage";
import { refreshToken } from "@/services/auth/api-services";
import { useRouter } from "next/navigation";
import { clearUser } from "@/stores/user-slice";
import { resetProfile } from "@/stores/account-slice";
import { clearCart } from "@/stores/cart-slice";
import { persistor } from "@/stores/store-client";
import { store, useAppDispatch } from "@/stores/store";


const REFRESH_INTERVAL = 1 * 60 * 1000;
export default function useAutoRefreshToken() {
  const router = useRouter();
  const dispatch = useAppDispatch();

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
        dispatch(clearUser());
        dispatch(resetProfile());
        dispatch(clearCart());
        persistor.pause();
        await persistor.flush();
        await persistor.purge();
        router.push("/login");
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [router]);
}
