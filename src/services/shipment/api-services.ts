import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/shipment/api-path";
import { OrderLog } from "./typings";

export const getShipmentLogs = async (id: string) => {
  const response = await request<TResponseData<OrderLog[]>>(
    API_ENDPOINTS.LOGS(id),
    {
      method: "GET",
    }
  );
  return response.data;
};