// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { getStorageItem, removeStorageItem, setStorageItem } from "@/utils/local-storage";
// import { refreshToken } from "@/services/auth/api-services";
// import { useAppDispatch } from "@/stores/store";
// import { getAccountProfile } from "@/services/account/api-services";
// import { setUser } from "@/stores/user-slice";

// export default function useInitialAuth() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     const init = async () => {
//       const accessToken = getStorageItem("accessToken");
//       const refresh = getStorageItem("refreshToken");

//       if (!refresh) {
//         router.replace("/login");
//         return;
//       }

//       try {
//         // Nếu không có accessToken → refresh lại ngay
//         if (!accessToken) {
//           const res = await refreshToken({ refreshToken: refresh });
//           const newAccessToken = res?.value?.data?.accessToken;
//           const newRefreshToken = res?.value?.data?.refreshToken;
//           setStorageItem("accessToken", newAccessToken);
//           setStorageItem("refreshToken", newRefreshToken);
//         }

//         // Sau khi có token → gọi API lấy user
//         const resProfile = await getAccountProfile(); // phải dùng axios instance `request`
//         if (resProfile?.value?.data) {
//           dispatch(setUser(resProfile.value.data));
//         } else {
//           throw new Error("Invalid profile");
//         }
//       } catch (error) {
//         removeStorageItem("accessToken");
//         removeStorageItem("refreshToken");
//         router.replace("/login");
//       }
//     };

//     init();
//   }, []);
// }

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStorageItem, removeStorageItem, setStorageItem } from "@/utils/local-storage";
import { refreshToken } from "@/services/auth/api-services";
import { useAppDispatch } from "@/stores/store";
import { getAccountProfile } from "@/services/account/api-services";
import { setUser } from "@/stores/user-slice";
import { clearUser } from "@/stores/user-slice";
import { resetProfile } from "@/stores/account-slice";
import { clearCart } from "@/stores/cart-slice";
import { resetChatState } from "@/stores/chat-slice"
import { persistor } from "@/stores/store-client";

// Sử dụng cache để tránh fetch lại profile nếu đã có
let cachedProfile: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

export default function useInitialAuth({ redirectIfUnauthenticated = true } = {}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = getStorageItem("accessToken");
        const refresh = getStorageItem("refreshToken");

        if (!refresh) {
          if (redirectIfUnauthenticated) {
            await handleLogout();
            router.replace("/login");
          }
          setLoading(false);
          return;
        }

        // Sử dụng profile từ cache nếu còn hiệu lực
        const now = Date.now();
        if (cachedProfile && (now - lastFetchTime < CACHE_DURATION)) {
          dispatch(setUser(cachedProfile));
          setLoading(false);
          return;
        }

        if (!accessToken) {
          const res = await refreshToken({ refreshToken: refresh });
          const newAccessToken = res?.value?.data?.accessToken;
          const newRefreshToken = res?.value?.data?.refreshToken;
          
          if (!newAccessToken || !newRefreshToken) {
            throw new Error("Failed to refresh token");
          }
          
          setStorageItem("accessToken", newAccessToken);
          setStorageItem("refreshToken", newRefreshToken);
        }

        // Fetch profile
        const profileRes = await getAccountProfile();
        const profile = profileRes?.value?.data;

        if (!profile) {
          throw new Error("Failed to fetch profile");
        }

        // Cập nhật cache
        cachedProfile = profile;
        lastFetchTime = Date.now();
        
        dispatch(setUser(profile));
      } catch (err) {
        await handleLogout();
        if (redirectIfUnauthenticated) {
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    const handleLogout = async () => {
      removeStorageItem("accessToken");
      removeStorageItem("refreshToken");
      dispatch(clearUser());
      dispatch(resetProfile());
      dispatch(clearCart());
      dispatch(resetChatState());
      cachedProfile = null;
      lastFetchTime = 0;
      
      // Thực hiện các thao tác này tuần tự để tránh block UI
      persistor.pause();
      await persistor.flush();
      await persistor.purge();
    };

    init();
  }, []);

  return { loading };
}
