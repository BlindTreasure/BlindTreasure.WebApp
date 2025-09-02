import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/inventory-item/api-path";
import {
  InventoryItem,
  GetItemInventoryResponse,
  GetItemInventoryParams,
  RequestShipment,
  ShipmentPreview,
  PreviewShipment,
  Delivery,
} from "./typings";

export const getItemInventory = async ({
  pageIndex,
  pageSize,
  status,
  isFromBlindBox
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
        status,
        isFromBlindBox
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

export const getItemInventoryByBlindBox = async (blindBoxId: string) => {
  const response = await request<TResponseData<InventoryItem>>(
    API_ENDPOINTS.INVENTORY_ITEM_BY_BLINDBOX(blindBoxId),
    {
      method: "GET",
    }
  );
  return response.data;
};

export const requestShipment = async (
  data: RequestShipment
): Promise<TResponseData<Delivery>> => {
  const response = await request.post<TResponseData<Delivery>>(
    API_ENDPOINTS.REQUEST_SHIPMENT,
    data
  );
  return response.data;
};

export const previewShipment = async (
  data: PreviewShipment
): Promise<TResponseData<ShipmentPreview[]>> => {
  const response = await request.post<TResponseData<ShipmentPreview[]>>(
    API_ENDPOINTS.PREVIEW_SHIPMENT,
    data
  );
  return response.data;
};