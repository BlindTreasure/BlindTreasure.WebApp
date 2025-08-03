import useToast from "@/hooks/use-toast";
import { getAllAvailableItem } from "@/services/listing/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";
import {API} from "@/services/listing/typings"

export default function useGetAllAvailableItem() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getAllAvailableItemApi = useCallback(async () => {
    setPending(true);
    try {
      const res = await getAllAvailableItem();
      if (isTResponseData(res)) {
        return res as TResponseData<API.AvailableItem[]>;
      } else {
        addToast({
          type: "error",
          description: "Failed to fetch available item for listing",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "An error occurred while fetching available item for listing",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getAllAvailableItemApi };
}
