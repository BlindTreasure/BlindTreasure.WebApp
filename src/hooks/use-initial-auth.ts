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

export default function useInitialAuth({ redirectIfUnauthenticated = true } = {}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const accessToken = getStorageItem("accessToken");
      const refresh = getStorageItem("refreshToken");

      if (!refresh) {
        if (redirectIfUnauthenticated) {
          dispatch(clearUser());
          dispatch(resetProfile()); 
          dispatch(clearCart());
          dispatch(resetChatState())
          persistor.pause();
          await persistor.flush();
          await persistor.purge();
          router.replace("/login");
        }
        setLoading(false);
        return;
      }

      try {
        if (!accessToken) {
          const res = await refreshToken({ refreshToken: refresh });
          const newAccessToken = res?.value?.data?.accessToken;
          const newRefreshToken = res?.value?.data?.refreshToken;
          setStorageItem("accessToken", newAccessToken);
          setStorageItem("refreshToken", newRefreshToken);
        }

        const profileRes = await getAccountProfile();
        const profile = profileRes?.value?.data;

        dispatch(setUser(profile));
        setLoading(false);
      } catch (err) {
        removeStorageItem("accessToken");
        removeStorageItem("refreshToken");
        dispatch(clearUser());
        dispatch(resetProfile());
        dispatch(clearCart());
        dispatch(resetChatState())
        persistor.pause();
        await persistor.flush();
        await persistor.purge();
        router.replace("/login");
      }
    };

    init();
  }, []);

  return { loading };
}
