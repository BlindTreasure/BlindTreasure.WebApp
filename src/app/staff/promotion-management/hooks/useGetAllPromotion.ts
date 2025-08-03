import useToast from "@/hooks/use-toast";
import { getAllPromotion } from "@/services/promotion/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetPromotion() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getPromotionApi = useCallback(async (params: REQUEST.GetPromotion) => {
    setPending(true);
    try {
      const res = await getAllPromotion(params);
      if (isTResponseData(res)) {
        return res as TResponseData<API.ResponseDataPromotion>;
      } else {
        addToast({
          type: "error",
          description: "Failed to fetch promotion",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "An error occurred while fetching promotion",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getPromotionApi };
}
