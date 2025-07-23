import { useServicePreviewShipment } from "@/services/inventory-item/services";
import {
  PreviewShipment,
  ShipmentPreview,
} from "@/services/inventory-item/typings";
import { useState } from "react";

export default function usePreviewShipment() {
  const [isPending, setPending] = useState(false);
  const { mutateAsync } = useServicePreviewShipment();

  const previewShipment = async (
    data: PreviewShipment
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

  return { previewShipment, isPending };
}
