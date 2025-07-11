import useToast from "@/hooks/use-toast";
import { getAllPromotionParticipant } from "@/services/promotion/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetPromotionParticipant() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getPromotionParticipantApi = useCallback(async (params: REQUEST.GetPromotionParticipant) => {
    setPending(true);
    try {
      const res = await getAllPromotionParticipant(params);
      if (isTResponseData(res)) {
        return res as TResponseData<API.ViewParticipantPromotion[]>;
      } else {
        addToast({
          type: "error",
          description: "Failed to fetch promotion participant",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "An error occurred while fetching promotion participant",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getPromotionParticipantApi };
}
