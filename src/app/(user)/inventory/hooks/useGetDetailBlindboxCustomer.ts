import { getBlindboxInventoryId } from "@/services/customer-blindboxes/api-services";
import { CustomerInventory } from "@/services/customer-blindboxes/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetDetailBlindboxCustomer() {
  const [isPending, setPending] = useState(false);

  const getDetailBlindboxCustomerApi = async (id: string) => {
    setPending(true);
    try {
      const res = await getBlindboxInventoryId(id);
      if (isTResponseData(res)) {
        return res as TResponseData<CustomerInventory>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { getDetailBlindboxCustomerApi, isPending };
}
