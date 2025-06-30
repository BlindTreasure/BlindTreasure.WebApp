import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/customer-inventory/api-path";
import { CustomerInventory } from "./typings";

export const getBlindboxInventory = async () => {
  const response = await request<TResponseData<CustomerInventory[]>>(
    API_ENDPOINTS.CUSTOMER_INVENTORY,
    {
      method: "GET",
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