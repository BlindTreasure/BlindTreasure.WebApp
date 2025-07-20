import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/shipping/api-path";
import { RequestDistricts, RequestWards, ResponseDistricts, ResponseProvinces, ResponseWards } from "./typings";

export const getProvinces = async (): Promise<TResponseData<ResponseProvinces[]>> => {
  const response = await request<TResponseData<ResponseProvinces[]>>(
    API_ENDPOINTS.SHIPPING_PROVINCES,
    {
      method: "GET",
    }
  );
  return response.data;
};

export const getDistricts = async (
  params: RequestDistricts
): Promise<TResponseData<ResponseDistricts[]>> => {
  const response = await request<TResponseData<ResponseDistricts[]>>(
    API_ENDPOINTS.SHIPPING_DISTRICTS,
    {
      method: "GET",
      params,
    }
  );
  return response.data;
};

export const getWards = async (params: RequestWards): Promise<TResponseData<ResponseWards[]>> => {
  const response = await request<TResponseData<ResponseWards[]>>(API_ENDPOINTS.SHIPPING_WARDS, {
    method: "GET",
    params,
  });
  return response.data;
};
