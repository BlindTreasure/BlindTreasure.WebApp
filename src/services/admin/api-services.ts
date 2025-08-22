import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/admin/api-path";
import { GetOrderParams, OrderResponse } from "./typings";

export const getOrderByAdmin = async (params?: GetOrderParams) => {
  const response = await request<TResponseData<OrderResponse>>(
    API_ENDPOINTS.ORDERS,
    {
      method: "GET",
      params,
    }
  );
  return response.data;
};