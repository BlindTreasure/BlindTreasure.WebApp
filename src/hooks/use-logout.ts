import { useAppDispatch } from "@/stores/store";
import { clearUser } from "@/stores/user-slice";

export default function useLogout() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(clearUser());
  };

  return { handleLogout };
}
