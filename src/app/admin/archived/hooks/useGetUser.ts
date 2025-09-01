import { isTResponseData } from "@/utils/compare";
import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { getUserAdmin } from "@/services/admin/api-services";
import { UserParams, UserResponse } from "@/services/admin/typings";

export default function useGetUserAdmin() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getUserAdminApi = async (params?: UserParams) => {
    setPending(true);
    try {
      const res = await getUserAdmin(params);
      if (isTResponseData(res)) {
        return res as TResponseData<UserResponse>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getUserAdminApi };
}
