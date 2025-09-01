import { isTResponseData } from "@/utils/compare";
import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { getShipmetsByAdmin } from "@/services/admin/api-services";
import { ShipmentResponse, ShipmentsParams } from "@/services/admin/typings";

export default function useGetShipmentsByAdmin() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getShipmentsByAdminApi = async (params?: ShipmentsParams) => {
    setPending(true);
    try {
      const res = await getShipmetsByAdmin(params);
      if (isTResponseData(res)) {
        return res as TResponseData<ShipmentResponse>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getShipmentsByAdminApi };
}
