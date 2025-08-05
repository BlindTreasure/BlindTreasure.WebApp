import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/promotion/api-path";
import { TGetPromotion, Promotion, RPromotion } from "./typing";

export const getAllPromotion = async ({
  search,
  sellerId,
  status,
  pageIndex,
  pageSize,
}: TGetPromotion): Promise<TResponseData<RPromotion>> => {
  // Tạo params object, chỉ include sellerId nếu nó có giá trị
  const params: any = {
    search,
    status,
    pageIndex,
    pageSize,
  };

  // Chỉ thêm sellerId vào params nếu nó có giá trị
  // Nếu sellerId là undefined/null, API sẽ trả về global promotions
  if (sellerId !== undefined && sellerId !== null) {
    params.sellerId = sellerId;
  }

  const response = await request<TResponseData<RPromotion>>(
    API_ENDPOINTS.PROMOTION,
    {
      method: "GET",
      params,
    }
  );
  return response.data;
};

export const getPromotionById = async (
  promotionId: string
): Promise<TResponseData<Promotion>> => {
  const response = await request<TResponseData<Promotion>>(
    API_ENDPOINTS.PROMOTION_WITH_ID(promotionId),
    {
      method: "GET",
    }
  );
  return response.data;
};
