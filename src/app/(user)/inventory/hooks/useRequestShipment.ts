import { useServiceRequestShipment } from "@/services/inventory-item/services";
import {
  RequestShipment,
  ShipmentPreview,
} from "@/services/inventory-item/typings";
import { useState } from "react";

export default function useRequestShipment() {
  const [isPending, setPending] = useState(false);
  const { mutateAsync } = useServiceRequestShipment();

  const requestShipment = async (
    data: RequestShipment
  ): Promise<ShipmentPreview[] | null> => {
    setPending(true);
    try {
      const res = await mutateAsync(data);
      return res.value.data;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { requestShipment, isPending };
}
