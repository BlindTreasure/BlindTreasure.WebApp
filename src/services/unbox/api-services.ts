import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/unbox/api-path";
import { GetUnboxLogsParams, ResponseUnboxLogs, ResponseUnboxLogsList, UnboxResult } from "./typings";

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
  PageIndex,
  PageSize,
}: GetUnboxLogsParams): Promise<TResponseData<ResponseUnboxLogsList>> => {
  const response = await request<TResponseData<ResponseUnboxLogsList>>(
    API_ENDPOINTS.UNBOX_LOGS,
    {
      method: "GET",
      params: {
        userId,
        productId,
        PageIndex,
        PageSize,
      },
    }
  );
  return response.data;
};