import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/unbox/api-path";
import { UnboxResult } from "./typings";

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
