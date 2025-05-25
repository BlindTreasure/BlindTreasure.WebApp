import { useServiceLogout } from "@/services/auth/services";
import { useAppDispatch } from "@/stores/store";
import useToast from "./use-toast";
import { useRouter } from "next/navigation";
import { removeStorageItem } from "@/utils/local-storage";
import { clearUser } from "@/stores/user-slice";
import { resetProfile } from "@/stores/account-slice";

export default function useLogout() {
  const { mutate: logout } = useServiceLogout();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: (data) => {
        removeStorageItem("accessToken");
        removeStorageItem("refreshToken");
        dispatch(clearUser());
        dispatch(resetProfile());
        router.push("/login");
      },
      onError: (error: any) => {
        const status = error?.response?.status;
        const message =
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          "Lỗi không xác định";

        if (status === 404) {
          addToast({
            type: "error",
            description: "Không tìm thấy phiên đăng nhập.",
          });
        } else {
          addToast({
            type: "error",
            description: message,
          });
        }

        removeStorageItem("accessToken");
        removeStorageItem("refreshToken");
        dispatch(clearUser());
        dispatch(resetProfile());
      },
    });
  };

  return { handleLogout };
}
