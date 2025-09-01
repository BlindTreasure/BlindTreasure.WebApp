import { isTResponseData } from "@/utils/compare";
import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { getItemInventoryAdmin } from "@/services/admin/api-services";
import { InventoryParams, InventoryResponse } from "@/services/admin/typings";

export default function useGetInventoryByAdmin() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getInventoryByAdminApi = async (params?: InventoryParams) => {
    setPending(true);
    try {
      const res = await getItemInventoryAdmin(params);
      if (isTResponseData(res)) {
        return res as TResponseData<InventoryResponse>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getInventoryByAdminApi };
}
