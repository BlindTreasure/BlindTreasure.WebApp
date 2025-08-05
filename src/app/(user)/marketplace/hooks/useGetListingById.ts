import useToast from "@/hooks/use-toast";
import { getListingById } from "@/services/listing/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";
import {REQUEST,API} from "@/services/listing/typings"

export default function useGetListingById() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getListingByIdApi = useCallback(async (listingId: string) => {
    setPending(true);
    try {
      const res = await getListingById(listingId);
      if (isTResponseData(res)) {
        return res as TResponseData<API.ListingItem>;
      } else {
        addToast({
          type: "error",
          description: "Failed to fetch listing by id",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "An error occurred while fetching listing by id",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getListingByIdApi };
}
