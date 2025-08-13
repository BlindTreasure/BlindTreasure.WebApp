import { useState } from "react";
import { getItemInventoryId } from "@/services/inventory-item/api-services";
import { InventoryItem } from "@/services/inventory-item/typings";

const useGetItemInventoryById = () => {
  const [isPending, setIsPending] = useState(false);

  const getItemInventoryByIdApi = async (id: string): Promise<{ value: { data: InventoryItem } } | null> => {
    setIsPending(true);
    try {
      const response = await getItemInventoryId(id);
      return { value: { data: response.value.data } };
    } catch (error) {
      console.error("Error fetching inventory item by ID:", error);
      return null;
    } finally {
      setIsPending(false);
    }
  };

  return {
    getItemInventoryByIdApi,
    isPending,
  };
};

export default useGetItemInventoryById;
