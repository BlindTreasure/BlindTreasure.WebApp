import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/customer-blindboxes/api-path";
import {
  CustomerInventory,
  GetBlindboxInventoryResponse,
  GetBlindboxInventoryParams,
} from "./typings";

export const getBlindboxInventory = async ({
  pageIndex,
  pageSize,
  isOpened,
}: GetBlindboxInventoryParams): Promise<
  TResponseData<GetBlindboxInventoryResponse>
> => {
  const response = await request<TResponseData<GetBlindboxInventoryResponse>>(
    API_ENDPOINTS.CUSTOMER_INVENTORY,
    {
      method: "GET",
      params: {
        pageIndex,
        pageSize,
        IsOpened: isOpened,
      },
    }
  );
  return response.data;
};

export const getBlindboxInventoryId = async (id: string) => {
  const response = await request<TResponseData<CustomerInventory>>(
    API_ENDPOINTS.CUSTOMER_INVENTORY_WITH_ID(id),
    {
      method: "GET",
    }
  );
  return response.data;
};
