import useToast from "@/hooks/use-toast";
import { getAllListing } from "@/services/listing/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";
import {REQUEST,API} from "@/services/listing/typings"

export default function useGetAllListing() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getAllListingApi = useCallback(async (params: REQUEST.GetAllListing) => {
    setPending(true);
    try {
      const res = await getAllListing(params);
      if (isTResponseData(res)) {
        return res as TResponseData<API.ListingItemResponse>;
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

  return { isPending, getAllListingApi };
}
