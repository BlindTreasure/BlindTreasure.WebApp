import useToast from "@/hooks/use-toast";
import { getAllStatusSeller } from "@/services/seller/api-services";
import { isTResponseData } from "@/utils/compare";
import { useRef, useState } from "react";

export default function useGetStatusSeller() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);
  const hasFetchedData = useRef(false);

  const getStatusSellersApi = async (params: REQUEST.GetSellers) => {
    setPending(true);
    try {
      const res = await getAllStatusSeller(params);
      if (isTResponseData(res)) {
        return res as TResponseData<API.ResponseDataSeller>;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getStatusSellersApi };
}
