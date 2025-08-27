import { useServiceLogout } from "@/services/auth/services";
import { store, useAppDispatch } from "@/stores/store";
import useToast from "./use-toast";
import { useRouter } from "next/navigation";
import { removeStorageItem } from "@/utils/local-storage";
import { clearUser } from "@/stores/user-slice";
import { resetProfile } from "@/stores/account-slice";
import { clearCart } from "@/stores/cart-slice";
import { persistor } from "@/stores/store-client";

export default function useLogout() {
  const { mutate: logout } = useServiceLogout();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: async (data) => {
        removeStorageItem("accessToken");
        removeStorageItem("refreshToken");
        dispatch(clearUser());
        dispatch(resetProfile());
        dispatch(clearCart());
        persistor.pause();
        await persistor.flush();
        await persistor.purge();
        router.push("/");
      },
      onError: async (error: any) => {
        const status = error?.response?.status;
        const message =
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          error?.detail ||
          "Lỗi không xác định";

        if (status === 404) {
          addToast({
            type: "error",
            description: "Không tìm thấy phiên đăng nhập.",
            duration: 5000,
          });
        } else {
          addToast({
            type: "error",
            description: message,
            duration: 5000,
          });
        }

        removeStorageItem("accessToken");
        removeStorageItem("refreshToken");
        dispatch(clearUser());
        dispatch(resetProfile());
        dispatch(clearCart());
        persistor.pause();
        await persistor.flush();
        await persistor.purge();
      },
    });
  };

  return { handleLogout };
}
