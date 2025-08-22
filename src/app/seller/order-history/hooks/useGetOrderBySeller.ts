import { isTResponseData } from "@/utils/compare";
import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { getOrderBySeller } from "@/services/product-seller/api-services";
import { GetOrderParams, OrderResponse } from "@/services/product-seller/typings";

export default function useGetOrderBySeller() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getOrderBySellerApi = async (params?: GetOrderParams) => {
    setPending(true);
    try {
      const res = await getOrderBySeller(params);
      if (isTResponseData(res)) {
        return res as TResponseData<OrderResponse>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getOrderBySellerApi };
}
