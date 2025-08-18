import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/unbox/api-path";
import { ExportUnboxLogsParams, GetUnboxLogsParams, ResponseUnboxLogs, ResponseUnboxLogsList, UnboxResult } from "./typings";

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

export const exportUnboxLogs = async ({
  userId,
  productId,
  FromDate,
  ToDate,
  PageIndex,
  PageSize,
  Desc,
}: ExportUnboxLogsParams) => {
  const response = await request<Blob>(API_ENDPOINTS.EXPORT_UNBOX_LOGS, {
    method: "GET",
    params: {
      userId,
      productId,
      FromDate,
      ToDate,
      PageIndex,
      PageSize,
      Desc,
    },
    responseType: "blob",
  });

  return response.data;
};
