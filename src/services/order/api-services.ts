import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/order/api-path";
import {
  GetOrderDetailParams,
  GetOrderParams,
  OrderDetailListResponse,
  OrderDetails,
  OrderListApiData,
  OrderResponse,
} from "./typings";

export const getOrderByCustomer = async (params?: GetOrderParams) => {
  const response = await request<TResponseData<OrderListApiData>>(
    API_ENDPOINTS.ORDER,
    {
      method: "GET",
      params,
    }
  );
  return response.data;
};

export const getOrderDetails = async (params?: GetOrderDetailParams) => {
  const response = await request<TResponseData<OrderDetailListResponse>>(
    API_ENDPOINTS.ORDER_DETAIL,
    {
      method: "GET",
      params,
    }
  );
  return response.data;
};

export const getOrdersByGroup = async (groupId: string) => {
  const response = await request<TResponseData<OrderResponse[]>>(
    API_ENDPOINTS.ORDER_GROUP(groupId),
    {
      method: "GET",
    }
  );
  return response.data;
};

export const getOrderDetailById = async (orderId: string) => {
  const response = await request<TResponseData<OrderResponse>>(
    API_ENDPOINTS.ORDER_WITH_ID(orderId),
    {
      method: "GET",
    }
  );
  return response.data;
};
