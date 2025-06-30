import useToast from "@/hooks/use-toast";
import { getBlindboxInventory } from "@/services/customer-inventory/api-services";
import { CustomerInventory } from "@/services/customer-inventory/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetAllBlindboxInventory() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getAllBlindboxInventoryApi = async () => {
    setPending(true);
    try {
      const res = await getBlindboxInventory();
      if (isTResponseData(res)) {
        return res as TResponseData<CustomerInventory[]>;
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
