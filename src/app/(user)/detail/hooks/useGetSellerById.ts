import useToast from "@/hooks/use-toast";
import { getSellerById } from "@/services/seller/api-services";
import { isTResponseData } from "@/utils/compare";
import { useRef, useState } from "react";

export default function useGetSellerById() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);
  const hasFetchedData = useRef(false);

  const getPSellerByIdApi = async (sellerId: string) => {
    setPending(true);
    try {
      const res = await getSellerById(sellerId);
      if (isTResponseData(res)) {
        return res as TResponseData<API.SellerById>;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getPSellerByIdApi };
}
