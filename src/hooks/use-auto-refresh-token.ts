"use client";

import { useEffect, useRef } from "react";
import { getStorageItem, setStorageItem, removeStorageItem } from "@/utils/local-storage";
import { refreshToken } from "@/services/auth/api-services";
import { useRouter } from "next/navigation";
import { clearUser } from "@/stores/user-slice";
import { resetProfile } from "@/stores/account-slice";
import { clearCart } from "@/stores/cart-slice";
import { resetChatState } from "@/stores/chat-slice"
import { persistor } from "@/stores/store-client";
import { store, useAppDispatch } from "@/stores/store";


// Tăng thời gian refresh từ 1 phút lên 10 phút
const REFRESH_INTERVAL = 10 * 60 * 1000; 
// Thời gian hết hạn của token (30 phút - thường token JWT có lifetime là 15-30 phút)
const TOKEN_EXPIRY = 30 * 60 * 1000;

export default function useAutoRefreshToken() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const lastRefreshTime = useRef<number>(Date.now());
  const refreshAttempted = useRef<boolean>(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentRefreshToken = getStorageItem("refreshToken");
      if (!currentRefreshToken) return;

      const now = Date.now();
      // Chỉ refresh nếu thời gian từ lần refresh cuối > 75% thời gian hết hạn token
      // hoặc nếu chưa từng refresh (khi mới load trang)
      if (now - lastRefreshTime.current < TOKEN_EXPIRY * 0.75 && refreshAttempted.current) {
        return;
      }

      try {
        refreshAttempted.current = true;
        const res = await refreshToken({ refreshToken: currentRefreshToken });
        const newAccessToken = res?.value?.data?.accessToken;
        const newRefreshToken = res?.value?.data?.refreshToken;

        if (newAccessToken && newRefreshToken) {
          setStorageItem("accessToken", newAccessToken);
          setStorageItem("refreshToken", newRefreshToken);
          lastRefreshTime.current = Date.now();
        } else {
          throw new Error("Invalid refresh response");
        }
      } catch (error) {
        // Xử lý lỗi như trước
        removeStorageItem("accessToken");
        removeStorageItem("refreshToken");
        dispatch(clearUser());
        dispatch(resetProfile());
        dispatch(clearCart());
        dispatch(resetChatState())
        persistor.pause();
        await persistor.flush();
        await persistor.purge();
        router.push("/login");
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [router, dispatch]);
}
