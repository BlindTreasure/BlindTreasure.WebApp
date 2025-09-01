import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/system/api-path";
import { CompletedParams } from "./typings";

export const getOrderByAdmin = async (data?: CompletedParams) => {
  const response = await request(API_ENDPOINTS.COMPLETED, {
    method: "POST",
    data,
  });
  return response.data;
};

export const itemInventoryArchived = async (inventoryItemId: string) => {
  const response = await request(API_ENDPOINTS.INVENTORY_ITEM_ARCHIVED(inventoryItemId),
    {
      method: "POST",
    }
  );
  return response.data;
};
