import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/blindboxes/api-path";
import {
  BlindBox,
  BlindBoxItemsRequest,
  BlindBoxListResponse,
  CreateBlindboxItemsParam,
  GetBlindBoxes,
  BlindBoxReviewRequest,
} from "./typings";

export const getAllBlindboxSeller = async ({
  search,
  SellerId,
  categoryId,
  status,
  minPrice,
  maxPrice,
  ReleaseDateFrom,
  ReleaseDateTo,
  HasItem,
  pageIndex,
  pageSize,
}: GetBlindBoxes): Promise<TResponseData<BlindBoxListResponse>> => {
  const response = await request<TResponseData<BlindBoxListResponse>>(
    API_ENDPOINTS.BLINDBOXES_All,
    {
      method: "GET",
      params: {
        search,
        SellerId,
        categoryId,
        status,
        minPrice,
        maxPrice,
        ReleaseDateFrom,
        ReleaseDateTo,
        HasItem,
        pageIndex,
        pageSize,
      },
    }
  );
  return response.data;
};

export const getBlindBoxById = async (
  blindboxesId: string
): Promise<TResponseData<BlindBox>> => {
  const response = await request<TResponseData<BlindBox>>(
    API_ENDPOINTS.BLINDBOXES_All_WITH_ID(blindboxesId),
    {
      method: "GET",
    }
  );
  return response.data;
};

export const createBlindbox = async (body: FormData) => {
  const response = await request<TResponseData<BlindBox>>(
    API_ENDPOINTS.BLINDBOXES_All,
    {
      method: "POST",
      data: body,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const createBlindboxItems = async (
  body: CreateBlindboxItemsParam
): Promise<TResponseData<BlindBoxListResponse>> => {
  const { blindboxesId, items } = body;

  const response = await request<TResponseData<BlindBoxListResponse>>(
    API_ENDPOINTS.ADD_ITEMS(blindboxesId),
    {
      method: "POST",
      data: items,
    }
  );

  return response.data;
};

export const submitBlindbox = async (
  blindboxesId: string
): Promise<TResponseData<BlindBoxListResponse>> => {
  const response = await request<TResponseData<BlindBoxListResponse>>(
    API_ENDPOINTS.SUBMIT_FORM(blindboxesId),
    {
      method: "POST",
    }
  );

  return response.data;
};

export const deleteAllItemBlindbox = async (
  blindboxesId: string
): Promise<TResponseData<BlindBoxListResponse>> => {
  const response = await request<TResponseData<BlindBoxListResponse>>(
    API_ENDPOINTS.DELETE_ITEMS(blindboxesId),
    {
      method: "DELETE",
    }
  );

  return response.data;
};

export const deleteBlindbox = async (
  blindboxesId: string
): Promise<TResponseData<BlindBoxListResponse>> => {
  const response = await request<TResponseData<BlindBoxListResponse>>(
    API_ENDPOINTS.BLINDBOXES_All_WITH_ID(blindboxesId),
    {
      method: "DELETE",
    }
  );

  return response.data;
};

export const updateBlindBox = async (blindboxesId: string, body: FormData) => {
  const response = await request<TResponseData<BlindBoxListResponse>>(
    API_ENDPOINTS.BLINDBOXES_All_WITH_ID(blindboxesId),
    {
      method: "PUT",
      data: body,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const reviewBlindbox = async (
  blindboxesId: string,
  body: BlindBoxReviewRequest
): Promise<TResponseData<BlindBoxListResponse>> => {
  const response = await request<TResponseData<BlindBoxListResponse>>(
    API_ENDPOINTS.REVIEW_BLINDBOXES(blindboxesId),
    {
      method: "POST",
      data: body,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
