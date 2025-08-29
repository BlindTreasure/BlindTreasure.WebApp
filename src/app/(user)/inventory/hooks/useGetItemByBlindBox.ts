import { useState, useEffect } from "react";
import { isTResponseData } from "@/utils/compare";
import { getItemInventoryByBlindBox } from "@/services/inventory-item/api-services";
import { InventoryItem } from "@/services/inventory-item/typings";

export default function useGetItemByBlindBox(blindBoxId: string) {
  const [inventoryItem, setInventoryItem] = useState<InventoryItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blindBoxId) return;

    const fetchInventoryItem = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getItemInventoryByBlindBox(blindBoxId);

        if (isTResponseData(response) && response.value.data) {
          const itemDataArray = response.value.data;

          if (Array.isArray(itemDataArray) && itemDataArray.length > 0) {
            setInventoryItem(itemDataArray[0]);
          } else {
            setError("Không tìm thấy item trong blindbox");
          }
        } else {
          setError("Không thể tải thông tin item từ blindbox");
        }
      } catch (err) {
        setError("Lỗi khi tải thông tin item từ blindbox");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryItem();
  }, [blindBoxId]);

  return {
    inventoryItem,
    isLoading,
    error,
  };
}
