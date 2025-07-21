 import { useServicePreviewShipping } from "@/services/stripe/services";
import { useState } from "react";

export default function usePreviewShipping() {
  const [isPending, setPending] = useState(false);
  const { mutateAsync } = useServicePreviewShipping();

  const previewShipping = async (
    data: REQUEST.CreateOrderList
  ): Promise<API.ShipmentPreview[] | null> => {
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

  return { previewShipping, isPending };
}
