import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/listing/api-path";
import {REQUEST,API} from "@/services/listing/typings"

export const getAllListing = async ({
  pageIndex,
  pageSize,
  status,
  isFree,
  isOwnerListings,
  userId,
  searchByName,
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
        isOwnerListings,
        userId,
        searchByName,
        desc
      },
    }
  );
  return response.data;
};

export const getAllAvailableItem = async (): Promise<TResponseData<API.AvailableItem[]>> => {
  const response = await request<TResponseData<API.AvailableItem[]>>(
    API_ENDPOINTS.AVAILABLE_ITEMS,
    {
      method: "GET",
    }
  );
  return response.data;
};

export const createListing = async (
  data: REQUEST.CreateListing
): Promise<TResponseData<API.ListingCreated>> => {
  const response = await request<TResponseData<API.ListingCreated>>(
    API_ENDPOINTS.LISTING,
    {
      method: "POST",
      data
    }
  );
  return response.data;
};

export const getListingById = async (listingId : string): Promise<TResponseData<API.ListingItem>> => {
  const response = await request<TResponseData<API.ListingItem>>(
    API_ENDPOINTS.LISTING_WITH_ID(listingId),
    {
      method: "GET",
    }
  );
  return response.data;
};

export const closeListing = async (listingId : string): Promise<TResponseData<API.ListingItem>> => {
  const response = await request<TResponseData<API.ListingItem>>(
    API_ENDPOINTS.CLOSE_LISTING(listingId),
    {
      method: "POST",
    }
  );
  return response.data;
};