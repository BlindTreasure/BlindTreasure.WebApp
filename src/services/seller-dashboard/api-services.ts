import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/seller-dashboard/api-path";
import {
  SellerStatisticsOrderStatus,
  SellerStatisticsOverview,
  SellerStatistics,
  SellerStatisticsResponse,
  SellerStatisticsTimeSeries,
  SellerStatisticsTopProduct,
  SellerStatisticsTopBlindboxes,
} from "./typings";

export const getSellerStatistics = async (
  body: SellerStatistics
): Promise<TResponseData<SellerStatisticsResponse>> => {
  const response = await request<TResponseData<SellerStatisticsResponse>>(
    API_ENDPOINTS.SELLER_STATISTICS_ME,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const getSellerStatisticsById = async (
  sellerId: string,
  body: SellerStatistics
): Promise<TResponseData<SellerStatisticsResponse>> => {  
  const response = await request<TResponseData<SellerStatisticsResponse>>(
    API_ENDPOINTS.SELLER_STATISTICS_BY_ID(sellerId),
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const getSellerStatisticsOverview = async (
  body: SellerStatistics
): Promise<TResponseData<SellerStatisticsOverview>> => {  
  const response = await request<TResponseData<SellerStatisticsOverview>>(
    API_ENDPOINTS.SELLER_STATISTICS_OVERVIEW,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const getSellerStatisticsTopProducts = async (   
  body: SellerStatistics
) => {  
  const response = await request<TResponseData<SellerStatisticsTopProduct[]>>(
    API_ENDPOINTS.SELLER_STATISTICS_TOP_PRODUCTS,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const getSellerStatisticsTopBlindBoxes = async (
  body: SellerStatistics
) => {  
  const response = await request<TResponseData<SellerStatisticsTopBlindboxes[]>>(
    API_ENDPOINTS.SELLER_STATISTICS_TOP_BLINDBOXES,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const getSellerStatisticsOrderStatus = async (
  body: SellerStatistics
) => {  
  const response = await request<TResponseData<SellerStatisticsOrderStatus[]>>(
    API_ENDPOINTS.SELLER_STATISTICS_ORDER_STATUS,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const getSellerStatisticsTimeSeries = async (
  body: SellerStatistics
) => {  
  const response = await request<TResponseData<SellerStatisticsTimeSeries>>(
    API_ENDPOINTS.SELLER_STATISTICS_TIME_SERIES,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

