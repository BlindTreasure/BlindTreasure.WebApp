import useToast from "@/hooks/use-toast";
import { getSellerById, getSellerOverview } from "@/services/seller/api-services";
import { isTResponseData } from "@/utils/compare";
import { useRef, useState } from "react";

export default function useGetOverviewSeller() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);
  const hasFetchedData = useRef(false);

  const getOverViewSellerApi = async (sellerId: string) => {
    setPending(true);
    try {
      const res = await getSellerOverview(sellerId);
      if (isTResponseData(res)) {
        return res as TResponseData<API.SellerInfo>;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getOverViewSellerApi };
}
