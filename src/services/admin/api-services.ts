import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/admin/api-path";
import { ConfirmPayoutRequest, GetOrderParams, OrderResponse, PayoutHistoryItem, PayoutHistoryParams, PayoutHistoryResponse } from "./typings";

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

export const confirmPayout = async (
  payoutId: string,
  body: ConfirmPayoutRequest
): Promise<TResponseData<PayoutHistoryItem>> => {
  const formData = new FormData();
  if (body.files && body.files.length > 0) {
    body.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const response = await request<TResponseData<PayoutHistoryItem>>(
    API_ENDPOINTS.CONFIRM(payoutId),
    {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};