import useToast from "@/hooks/use-toast";
import { viewTradeRequestByListingId } from "@/services/trading/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetAllTradeRequestByListingId() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getAllTradeRequestByListingId = useCallback(async (listingId: string) => {
    setPending(true);
    try {
      const res = await viewTradeRequestByListingId(listingId);
      if (isTResponseData(res)) {
        return res as TResponseData<API.TradeRequest[]>;
      } else {
        addToast({
          type: "error",
          description: "Failed to fetch trade request of this listing",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "An error occurred while fetching trade request of this listing",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getAllTradeRequestByListingId };
}
