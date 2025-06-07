import useToast from "@/hooks/use-toast";
import { getAllProductSeller } from "@/services/product-seller/api-services";
import {
  GetProduct,
  TProductResponse,
} from "@/services/product-seller/typings";
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
      const res = await getAllProductSeller(params);
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
