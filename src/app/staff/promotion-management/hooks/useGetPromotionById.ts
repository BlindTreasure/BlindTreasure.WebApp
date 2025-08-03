import useToast from "@/hooks/use-toast";
import { getPromotionById } from "@/services/promotion/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetPromotionById() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getPromotionByIdApi = useCallback(async (promotionId: string) => {
    setPending(true);
    try {
      const res = await getPromotionById(promotionId);
      if (isTResponseData(res)) {
        return res as TResponseData<API.Promotion>;
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

  return { isPending, getPromotionByIdApi };
}
