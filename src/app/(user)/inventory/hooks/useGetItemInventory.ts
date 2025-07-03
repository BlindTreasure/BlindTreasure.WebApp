import { getItemInventory } from "@/services/inventory-item/api-services";
import {
  GetItemInventoryResponse,
  GetItemInventoryParams,
} from "@/services/inventory-item/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetAllItemInventory() {
  const [isPending, setPending] = useState(false);

  const getAllItemInventoryApi = async (
    params: GetItemInventoryParams = {}
  ) => {
    setPending(true);
    try {
      const res = await getItemInventory(params);
      if (isTResponseData(res)) {
        return res as GetItemInventoryResponse;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { getAllItemInventoryApi, isPending };
}
