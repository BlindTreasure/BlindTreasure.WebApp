import useToast from "@/hooks/use-toast";
import { getProductById } from "@/services/product/api-services";
import { AllProduct, TAllProductResponse } from "@/services/product/typings";
import { isTResponseData } from "@/utils/compare";
import { useRef, useState } from "react";

export default function useGetProductByIdWeb() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);
  const hasFetchedData = useRef(false);

  const getProductByIdWebApi = async (productId: string) => {
    setPending(true);
    try {
      const res = await getProductById(productId);
      if (isTResponseData(res)) {
        return res as TResponseData<AllProduct>;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getProductByIdWebApi };
}
