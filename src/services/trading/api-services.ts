import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/trading/api-path";

export const viewTradeRequestByListingId = async (
  listingId: string
): Promise<TResponseData<API.TradeRequest[]>> => {
  const response = await request<TResponseData<API.TradeRequest[]>>(
    API_ENDPOINTS.VIEW_TRADE_REQUEST_LISTING(listingId),
    {
      method: "GET",
    }
  );
  return response.data;
};

export const respondTradeRequest = async (
  {tradeRequestId, isAccepted} : REQUEST.AcceptTradeRequest
): Promise<TResponseData<API.TradeRequest>> => {
  const response = await request<TResponseData<API.TradeRequest>>(
    API_ENDPOINTS.ACCEPT_TRADE_REQUEST(tradeRequestId),
    {
      method: "POST",
      params: {
        isAccepted
      }
    }
  );
  return response.data;
};

export const createTradeRequestByListingId = async (
  listingId: string,
  payload: REQUEST.OfferedInventory
): Promise<TResponseData<API.TradeRequest>> => {
  const response = await request<TResponseData<API.TradeRequest>>(
    API_ENDPOINTS.VIEW_TRADE_REQUEST_LISTING(listingId),
    {
      method: "POST",
      data: payload
    }
  );
  return response.data;
};

export const viewTradeRequestDetail = async (
  tradeRequestId : string
): Promise<TResponseData<API.TradeRequest>> => {
  const response = await request<TResponseData<API.TradeRequest>>(
    API_ENDPOINTS.VIEW_TRADE_REQUEST_DETAIL(tradeRequestId),
    {
      method: "GET",
    }
  );
  return response.data;
};

export const lockTradeRequest= async (
  tradeRequestId : string
): Promise<TResponseData<API.TradeRequest>> => {
  const response = await request<TResponseData<API.TradeRequest>>(
    API_ENDPOINTS.LOCK_TRADE_REQUEST(tradeRequestId),
    {
      method: "POST",
    }
  );
  return response.data;
};

export const viewMyTradeRequest = async ()
: Promise<TResponseData<API.TradeRequest[]>> => {
  const response = await request<TResponseData<API.TradeRequest[]>>(
    API_ENDPOINTS.VIEW_MY_TRADE_REQUEST,
    {
      method: "GET",
    }
  );
  return response.data;
};