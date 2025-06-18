import useToast from "@/hooks/use-toast";
import {
  getAccountProfile,
  getAddresses,
} from "@/services/account/api-services";
import { getOrderByCustomer } from "@/services/order/api-services";
import { OrderResponse } from "@/services/order/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetAllOrder() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getAllOrderApi = async () => {
    setPending(true);
    try {
      const res = await getOrderByCustomer();
      if (isTResponseData(res)) {
        return res as TResponseData<OrderResponse[]>;
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
