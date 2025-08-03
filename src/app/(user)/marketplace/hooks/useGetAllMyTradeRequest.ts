import useToast from "@/hooks/use-toast";
import { viewMyTradeRequest } from "@/services/trading/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetAllMyTradeRequest() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getAllMyTradeRequestApi = useCallback(async () => {
    setPending(true);
    try {
      const res = await viewMyTradeRequest();
      if (isTResponseData(res)) {
        return res as TResponseData<API.TradeRequest[]>;
      } else {
        addToast({
          type: "error",
          description: "Failed to fetch my trade request",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "An error occurred while fetching my trade request",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getAllMyTradeRequestApi };
}
