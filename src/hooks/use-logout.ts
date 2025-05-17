
import { useServiceLogout } from "@/services/auth/services";

export default function useLogout() {
  const { mutate: logout } = useServiceLogout();

  const handleLogout = () => {
    logout();
  };

  return { handleLogout };
}
