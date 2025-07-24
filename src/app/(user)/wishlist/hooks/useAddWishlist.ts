import useToast from "@/hooks/use-toast";
import { addWishlist } from "@/services/customer-favourite/api-services";
import {
  RequestAddFavourite,
  WishlistItem,
} from "@/services/customer-favourite/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useAddWishlist() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const addWishlistApi = async (body: RequestAddFavourite) => {
    setPending(true);
    try {
      const res = await addWishlist(body);
      if (isTResponseData(res)) {
        return res as TResponseData<WishlistItem>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { addWishlistApi, isPending };
}
