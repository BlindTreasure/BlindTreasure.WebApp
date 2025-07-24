import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/customer-favourite/api-path";
import { RequestAddFavourite, RequestFavourite, WishlistItem, WishlistResponse } from "./typings";

export const getWishlist = async ({
  pageIndex,
  pageSize,
}: RequestFavourite): Promise<TResponseData<WishlistResponse>> => {
  const response = await request<TResponseData<WishlistResponse>>(
    API_ENDPOINTS.CUSTOMER_FAVOURITE,
    {
      method: "GET",
      params: {
        pageIndex,
        pageSize,
      },
    }
  );
  return response.data;
};

export const addWishlist = async (
  body: RequestAddFavourite
): Promise<TResponseData<WishlistItem>> => {
  const response = await request<TResponseData<WishlistItem>>(
    API_ENDPOINTS.CUSTOMER_FAVOURITE,
    {
      method: "POST",
      data: body,
    }
  );
  return response.data;
};

export const deleteWishlist = async (
  favouriteId: string
): Promise<TResponse> => {
  const response = await request<TResponse>(
    API_ENDPOINTS.CUSTOMER_FAVOURITE_WITH_ID(favouriteId),
    {
      method: "DELETE",
    }
  );
  return response.data;
};
