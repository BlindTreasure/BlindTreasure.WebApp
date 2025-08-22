import { isTResponseData } from "@/utils/compare";
import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { getOrderByAdmin } from "@/services/admin/api-services";
import { GetOrderParams, OrderResponse } from "@/services/admin/typings";

export default function useGetOrderByAdmin() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getOrderByAdminApi = async (params?: GetOrderParams) => {
    setPending(true);
    try {
      const res = await getOrderByAdmin(params);
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

  return { isPending, getOrderByAdminApi };
}
