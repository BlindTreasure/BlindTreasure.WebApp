import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/payout/api-path";
import { SellerPayoutSummary } from "./typings";

export const requestPayout = async (): Promise<TResponseData<boolean>> => {
  const response = await request<TResponseData<boolean>>(
    API_ENDPOINTS.REQUEST,
    {
      method: "POST",
    }
  );

  return response.data;
};

export const calculateUpcoming = async (): Promise<
  TResponseData<SellerPayoutSummary>
> => {
  const response = await request<TResponseData<SellerPayoutSummary>>(
    API_ENDPOINTS.CALCULATE_UPCOMING,
    {
      method: "POST",
    }
  );

  return response.data;
};

export const processPayout = async (
  sellerId: string
): Promise<TResponseData<boolean>> => {
  const response = await request<TResponseData<boolean>>(
    API_ENDPOINTS.PROCESS(sellerId),
    {
      method: "POST",
    }
  );

  return response.data;
};

export const exportHistory = async (): Promise<Blob> => {
  const response = await request<Blob>(API_ENDPOINTS.EXPORT_LATEST, {
    method: "GET",
    responseType: "blob",
  });

  return response.data;
};

