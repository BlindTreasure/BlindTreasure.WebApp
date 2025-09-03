import { isTResponseData } from "@/utils/compare";
import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { getUserSeller } from "@/services/seller/api-services";

export default function useGetUserSeller() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getUserSellerApi = async () => {
    setPending(true);
    try {
      const res = await getUserSeller();
      if (isTResponseData(res)) {
        return res as TResponseData<API.UserItem[]>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getUserSellerApi };
}
