import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/admin/api-path";
import { GetOrderParams, OrderResponse, PayoutHistoryParams, PayoutHistoryResponse } from "./typings";

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

export const getPayoutSummary = async (params?: PayoutHistoryParams) => {
  const response = await request<TResponseData<PayoutHistoryResponse>>(
    API_ENDPOINTS.PAYOUTS,
    {
      method: "GET",
      params,
    }
  );
  return response.data;
};
