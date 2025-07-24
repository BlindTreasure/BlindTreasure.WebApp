import useToast from "@/hooks/use-toast";
import { deleteWishlist } from "@/services/customer-favourite/api-services";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useDeleteWishlist() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const deleteWishlistApi = async (favouriteId: string) => {
    setPending(true);
    try {
      const res = await deleteWishlist(favouriteId);
      if (isTResponseData(res)) {
        return res as TResponse;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { deleteWishlistApi, isPending };
}
