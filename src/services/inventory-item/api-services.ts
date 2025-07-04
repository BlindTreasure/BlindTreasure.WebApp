import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/inventory-item/api-path";
import {
  InventoryItem,
  GetItemInventoryResponse,
  GetItemInventoryParams,
} from "./typings";

export const getItemInventory = async ({
  pageIndex,
  pageSize,
}: GetItemInventoryParams): Promise<
  TResponseData<GetItemInventoryResponse>
> => {
  const response = await request<TResponseData<GetItemInventoryResponse>>(
    API_ENDPOINTS.INVENTORY_ITEMS,
    {
      method: "GET",
      params: {
        pageIndex,
        pageSize,
      },
    }
  );
  return response.data;
};

export const getItemInventoryId = async (id: string) => {
  const response = await request<TResponseData<InventoryItem>>(
    API_ENDPOINTS.INVENTORY_ITEM_BY_ID(id),
    {
      method: "GET",
    }
  );
  return response.data;
};
