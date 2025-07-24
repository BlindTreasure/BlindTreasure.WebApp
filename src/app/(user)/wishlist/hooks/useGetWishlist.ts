import useToast from "@/hooks/use-toast";
import { getWishlist } from "@/services/customer-favourite/api-services";
import { RequestFavourite, WishlistResponse } from "@/services/customer-favourite/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetWishlist() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getWishlistApi = async (params: RequestFavourite) => {
    setPending(true);
    try {
      const res = await getWishlist(params);
      if (isTResponseData(res)) {
        return res as TResponseData<WishlistResponse>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { getWishlistApi, isPending };
}
