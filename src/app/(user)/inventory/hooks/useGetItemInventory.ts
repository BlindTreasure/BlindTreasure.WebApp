import useToast from "@/hooks/use-toast";
import { getItemInventory } from "@/services/inventory-item/api-services";
import { InventoryItem } from "@/services/inventory-item/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetAllItemInventory() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getAllItemInventoryApi = async () => {
    setPending(true);
    try {
      const res = await getItemInventory();
      if (isTResponseData(res)) {
        return res as TResponseData<InventoryItem[]>;
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
