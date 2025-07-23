import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/unbox/api-path";
import { GetUnboxLogsParams, ResponseUnboxLogs, UnboxResult } from "./typings";

export const unbox = async (
  customerBlindBoxId: string
): Promise<TResponseData<UnboxResult>> => {
  const response = await request<TResponseData<UnboxResult>>(
    API_ENDPOINTS.UNBOX_WITH_ID(customerBlindBoxId),
    {
      method: "POST",
    }
  );

  return response.data;
};

export const getUnboxLogs = async ({
  userId,
  productId,
}: GetUnboxLogsParams): Promise<TResponseData<ResponseUnboxLogs[]>> => {
  const response = await request<TResponseData<ResponseUnboxLogs[]>>(
    API_ENDPOINTS.UNBOX_LOGS,
    {
      method: "GET",
      params: {
        userId,
        productId,
      },
    }
  );
  return response.data;
};