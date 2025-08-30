import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/admin-dashboard/api-path";
import { AdminStatistics, CustomerSummary, OrderSummary, RevenueSummary, SellerSummary, TimeSeries, TopCategory } from "./typings";

export const revenueSummary = async (
  body: AdminStatistics
): Promise<TResponseData<RevenueSummary>> => {
  const response = await request<TResponseData<RevenueSummary>>(
    API_ENDPOINTS.REVENUE_SUMMARY,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const orderSummary = async (
  body: AdminStatistics
): Promise<TResponseData<OrderSummary>> => {
  const response = await request<TResponseData<OrderSummary>>(
    API_ENDPOINTS.ORDER_SUMMARY,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const sellerSummary = async (
  body: AdminStatistics
): Promise<TResponseData<SellerSummary>> => {
  const response = await request<TResponseData<SellerSummary>>(
    API_ENDPOINTS.SELLER_SUMMARY,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const customerSummary = async (
  body: AdminStatistics
): Promise<TResponseData<CustomerSummary>> => {
  const response = await request<TResponseData<CustomerSummary>>(
    API_ENDPOINTS.CUSTOMER_SUMMARY,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const topCategories = async (
  body: AdminStatistics
): Promise<TResponseData<TopCategory>> => {
  const response = await request<TResponseData<TopCategory>>(
    API_ENDPOINTS.TOP_CATEGORIES,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const timeSeries = async (
  body: AdminStatistics
): Promise<TResponseData<TimeSeries>> => {
  const response = await request<TResponseData<TimeSeries>>(
    API_ENDPOINTS.TIME_SERIES,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};