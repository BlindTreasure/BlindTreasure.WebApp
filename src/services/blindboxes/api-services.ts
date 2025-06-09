import request from "@/components/interceptor";
import API_ENDPOINTS from "@/services/blindboxes/api-path";
import { BlindBox, BlindBoxItemsRequest, BlindBoxListResponse, GetBlindBoxes } from "./typings";

export const getAllBlindboxSeller = async ({
  search,
  SellerId,
  categoryId,
  status,
  minPrice,
  maxPrice,
  ReleaseDateFrom,
  ReleaseDateTo,
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
        pageIndex,
        pageSize,
      },
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
  body: BlindBoxItemsRequest & { blindboxesId: string }
): Promise<TResponseData<BlindBoxListResponse>> => {
  const { blindboxesId, ...data } = body;

  const response = await request<TResponseData<BlindBoxListResponse>>(
    API_ENDPOINTS.ADD_ITEMS(blindboxesId),
    {
      method: "POST",
      data,
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


