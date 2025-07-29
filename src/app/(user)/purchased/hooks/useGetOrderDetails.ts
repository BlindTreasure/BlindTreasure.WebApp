import useToast from "@/hooks/use-toast";
import { getOrderDetails } from "@/services/order/api-services";
import { OrderDetails } from "@/services/order/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetOrderDetails() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getOrderDetailsApi = async () => {
    setPending(true);
    try {
      const res = await getOrderDetails();
      if (isTResponseData(res)) {
        return res as TResponseData<OrderDetails[]>;
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
