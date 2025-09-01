import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/admin/api-path";
import {
  ConfirmPayoutRequest,
  GetOrderParams,
  OrderResponse,
  PayoutHistoryItem,
  PayoutHistoryParams,
  PayoutHistoryResponse,
  GetInventoryOnHoldParams,
  InventoryOnHoldResponse,
  TransactionsParams,
  StripeTransactionResponse,
  StripeTransaction,
  ShipmentsParams,
  ShipmentResponse,
  InventoryResponse,
  InventoryParams,
  UserParams,
  UserResponse,
} from "./typings";
import { InventoryItem } from "@/services/inventory-item/typings";

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

export const forceReleaseHold = async (
  inventoryItemId: string
): Promise<TResponseData<InventoryItem>> => {
  const response = await request<TResponseData<InventoryItem>>(
    API_ENDPOINTS.FORCE_RELEASE_HOLD(inventoryItemId),
    {
      method: "POST",
    }
  );

  return response.data;
};

export const forceTimeout = async (
  tradeRequestId: string
): Promise<TResponseData<API.TradeRequest>> => {
  const response = await request<TResponseData<API.TradeRequest>>(
    API_ENDPOINTS.FORCE_TIMEOUT(tradeRequestId),
    {
      method: "POST",
    }
  );

  return response.data;
};

export const getInventoryOnHold = async (params?: GetInventoryOnHoldParams) => {
  const response = await request<TResponseData<InventoryOnHoldResponse>>(
    API_ENDPOINTS.INVENTORY_ONHOLD,
    {
      method: "GET",
      params,
    }
  );
  return response.data;
};

export const getTransactionsByAdmin = async (params?: TransactionsParams) => {
  const response = await request<TResponseData<StripeTransactionResponse>>(
    API_ENDPOINTS.STRIPE_TRANSACTIONS,
    {
      method: "GET",
      params,
    }
  );
  return response.data;
};

export const getTransactionId = async (id: string) => {
  const response = await request<TResponseData<StripeTransaction>>(
    API_ENDPOINTS.DETAIL_TRANSACTIONS(id),
    {
      method: "GET",
    }
  );
  return response.data;
};

export const getShipmetsByAdmin = async (params?: ShipmentsParams) => {
  const response = await request<TResponseData<ShipmentResponse>>(
    API_ENDPOINTS.SHIPMENT_LIST,
    {
      method: "GET",
      params,
    }
  );
  return response.data;
};

export const getItemInventoryAdmin = async (params?: InventoryParams) => {
  const response = await request<TResponseData<InventoryResponse>>(
    API_ENDPOINTS.INVENTORY_ITEMS,
    {
      method: "GET",
      params,
    }
  );
  return response.data;
};

export const getUserAdmin = async (params?: UserParams) => {
  const response = await request<TResponseData<UserResponse>>(
    API_ENDPOINTS.USER,
    {
      method: "GET",
      params,
    }
  );
  return response.data;
};