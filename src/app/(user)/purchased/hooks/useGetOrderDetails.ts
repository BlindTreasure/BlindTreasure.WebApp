import useToast from "@/hooks/use-toast";
import { getOrderDetails } from "@/services/order/api-services";
import {
  GetOrderDetailParams,
  OrderDetailListResponse,
  OrderDetails,
} from "@/services/order/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetOrderDetails() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getOrderDetailsApi = async (params?: GetOrderDetailParams) => {
    setPending(true);
    try {
      const res = await getOrderDetails(params);
      if (isTResponseData(res)) {
        return res as TResponseData<OrderDetailListResponse>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { getOrderDetailsApi, isPending };
}
