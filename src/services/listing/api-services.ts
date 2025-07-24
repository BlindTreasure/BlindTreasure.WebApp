import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/listing/api-path";
import {REQUEST,API} from "@/services/listing/typings"

export const getAllListing = async ({
  pageIndex,
  pageSize,
  status,
  isFree,
  desc
}: REQUEST.GetAllListing): Promise<TResponseData<API.ListingItemResponse>> => {
  const response = await request<TResponseData<API.ListingItemResponse>>(
    API_ENDPOINTS.LISTING,
    {
      method: "GET",
      params: {
        pageIndex,
        pageSize,
        status,
        isFree,
        desc
      },
    }
  );
  return response.data;
};

