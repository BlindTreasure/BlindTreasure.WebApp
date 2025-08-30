import { getInventoryOnHold } from "@/services/admin/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";
import {GetInventoryOnHoldParams, InventoryOnHoldResponse} from '@/services/admin/typings'

export default function useGetInventoryOnHold() {
  const [isPending, setPending] = useState(false);

  const getInventoryOnHoldApi = useCallback(async (params: GetInventoryOnHoldParams) => {
    setPending(true);
    try {
      const res = await getInventoryOnHold(params);
      if (isTResponseData(res)) {
        return res as TResponseData<InventoryOnHoldResponse>;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getInventoryOnHoldApi };
}
