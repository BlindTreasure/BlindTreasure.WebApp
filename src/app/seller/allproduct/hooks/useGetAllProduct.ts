import useToast from "@/hooks/use-toast";
import { getAllProduct } from "@/services/product/api-services";
import { GetProduct, TProductResponse } from "@/services/product/typings";
import { getAllStatusSeller } from "@/services/seller/api-services";
import { isTResponseData } from "@/utils/compare";
import { useRef, useState } from "react";

export default function useGetAllProduct() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);
  const hasFetchedData = useRef(false);

  const getAllProductApi = async (params: GetProduct) => {
    setPending(true);
    try {
      const res = await getAllProduct(params);
      if (isTResponseData(res)) {
        return res as TResponseData<TProductResponse>;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getAllProductApi };
}
