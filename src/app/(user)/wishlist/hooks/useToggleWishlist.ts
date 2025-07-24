import { useState } from "react";
import { RequestAddFavourite } from "@/services/customer-favourite/typings";
import {
  useServiceAddWishlist,
  useServiceDeleteWishlist,
} from "@/services/customer-favourite/services";

interface UseToggleWishlistProps {
  initialIsInWishlist?: boolean;
  initialWishlistId?: string;
}

export default function useToggleWishlist({
  initialIsInWishlist = false,
  initialWishlistId,
}: UseToggleWishlistProps = {}) {
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
  const [wishlistId, setWishlistId] = useState<string | undefined>(
    initialWishlistId
  );

  const addWishlistMutation = useServiceAddWishlist();
  const deleteWishlistMutation = useServiceDeleteWishlist();

  const toggleWishlist = async (addData: RequestAddFavourite) => {
    if (addWishlistMutation.isPending || deleteWishlistMutation.isPending)
      return;

    try {
      if (isInWishlist && wishlistId) {
        await deleteWishlistMutation.mutateAsync(wishlistId);
        setIsInWishlist(false);
        setWishlistId(undefined);
        return { success: true, action: "removed" };
      } else {
        const result = await addWishlistMutation.mutateAsync(addData);
        setIsInWishlist(true);
        setWishlistId(result.value.data.id);
        return { success: true, action: "added" };
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      return { success: false, action: null };
    }
  };

  return {
    isInWishlist,
    wishlistId,
    toggleWishlist,
    isPending:
      addWishlistMutation.isPending || deleteWishlistMutation.isPending,
    setIsInWishlist,
    setWishlistId,
  };
}
