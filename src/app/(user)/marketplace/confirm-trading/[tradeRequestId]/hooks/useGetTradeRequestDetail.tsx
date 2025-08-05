import useToast from "@/hooks/use-toast";
import { viewTradeRequestDetail } from "@/services/trading/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetTradeRequestDetail() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getTradeRequestDetailApi = useCallback(async (tradeRequestId : string) => {
    setPending(true);
    try {
      const res = await viewTradeRequestDetail(tradeRequestId);
      if (isTResponseData(res)) {
        return res as TResponseData<API.TradeRequest>;
      } else {
        addToast({
          type: "error",
          description: "Failed to fetch listing",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "An error occurred while fetching listing",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getTradeRequestDetailApi };
}
