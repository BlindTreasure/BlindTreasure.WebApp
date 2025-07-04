import useToast from "@/hooks/use-toast";
import { getOrderByCustomer } from "@/services/order/api-services";
import { GetOrderParams, OrderListApiData } from "@/services/order/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetAllOrder() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getAllOrderApi = async (params?: GetOrderParams) => {
    setPending(true);
    try {
      const res = await getOrderByCustomer(params);
      if (isTResponseData(res)) {
        return res as TResponseData<OrderListApiData>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { getAllOrderApi, isPending };
}
