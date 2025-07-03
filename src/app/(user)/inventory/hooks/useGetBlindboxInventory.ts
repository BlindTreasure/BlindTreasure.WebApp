import { getBlindboxInventory } from "@/services/customer-blindboxes/api-services";
import {
  GetBlindboxInventoryResponse,
  GetBlindboxInventoryParams,
} from "@/services/customer-blindboxes/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetAllBlindboxInventory() {
  const [isPending, setPending] = useState(false);

  const getAllBlindboxInventoryApi = async (
    params: GetBlindboxInventoryParams = {}
  ) => {
    setPending(true);
    try {
      const res = await getBlindboxInventory(params);
      if (isTResponseData(res)) {
        return res as GetBlindboxInventoryResponse;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { getAllBlindboxInventoryApi, isPending };
}
