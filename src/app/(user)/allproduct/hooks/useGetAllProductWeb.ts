import useToast from "@/hooks/use-toast";
import { getAllProduct } from "@/services/product/api-services";
import { GetAllProducts, TAllProductResponse } from "@/services/product/typings";
import { isTResponseData } from "@/utils/compare";
import { useRef, useState } from "react";

export default function useGetAllProductWeb() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);
  const hasFetchedData = useRef(false);

  const getAllProductWebApi = async (params: GetAllProducts) => {
    setPending(true);
    try {
      const res = await getAllProduct(params);
      if (isTResponseData(res)) {
        return res as TResponseData<TAllProductResponse>;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getAllProductWebApi };
}
