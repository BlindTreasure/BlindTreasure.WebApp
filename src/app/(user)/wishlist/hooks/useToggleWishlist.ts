import { useState } from "react";
import { RequestAddFavourite } from "@/services/customer-favourite/typings";
import {
  useServiceAddWishlist,
  useServiceDeleteWishlist,
} from "@/services/customer-favourite/services";
import { useWishlistContext } from "@/contexts/WishlistContext";

interface UseToggleWishlistProps {
  initialIsInWishlist?: boolean;
  initialWishlistId?: string;
  onWishlistChange?: () => void;
}

export default function useToggleWishlist({
  initialIsInWishlist = false,
  initialWishlistId,
  onWishlistChange,
}: UseToggleWishlistProps = {}) {
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
  const [wishlistId, setWishlistId] = useState<string | undefined>(
    initialWishlistId
  );

  const { updateWishlistStatus } = useWishlistContext();
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

        const itemId = addData.productId || addData.blindBoxId;
        if (itemId) {
          updateWishlistStatus(itemId, false);
        }

        onWishlistChange?.();
        return { success: true, action: "removed" };
      } else {
        const result = await addWishlistMutation.mutateAsync(addData);
        setIsInWishlist(true);
        setWishlistId(result.value.data.id);

        const itemId = addData.productId || addData.blindBoxId;
        if (itemId) {
          updateWishlistStatus(itemId, true, result.value.data.id);
        }

        onWishlistChange?.();
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
