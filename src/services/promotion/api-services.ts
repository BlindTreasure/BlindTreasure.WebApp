import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/promotion/api-path";
import { TGetPromotion, Promotion, RPromotion } from "./typing";

export const getAllPromotion = async ({
  search,
  status,
  isParticipated,
  participantSellerId,
  pageIndex,
  pageSize,
}: TGetPromotion): Promise<TResponseData<RPromotion>> => {
  const params: any = {
    search,
    status,
    isParticipated,
    participantSellerId,
    pageIndex,
    pageSize,
  };
  // if (sellerId !== undefined && sellerId !== null) {
  //   params.sellerId = sellerId;
  // }

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

export const createPromotion = async (
  data: REQUEST.PromotionForm
): Promise<TResponseData<API.Promotion>> => {
  const formData = new FormData();
  formData.append("Code", data.code.trim().toUpperCase());
  formData.append("Description", data.description);
  formData.append("DiscountType", data.discountType);
  formData.append("DiscountValue", data.discountValue.toString());
  formData.append("StartDate", data.startDate);
  formData.append("EndDate", data.endDate);
  formData.append("UsageLimit", data.usageLimit.toString());

  const response = await request<TResponseData<API.Promotion>>(
    API_ENDPOINTS.PROMOTION,
    {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updatePromotion = async (
  payload: REQUEST.PromotionForm & { promotionId: string }
): Promise<TResponseData<API.Promotion>> => {
  const { promotionId, ...data } = payload;

  const formData = new FormData();
  formData.append("Code", data.code.trim().toUpperCase());
  formData.append("Description", data.description);
  formData.append("DiscountType", data.discountType);
  formData.append("DiscountValue", data.discountValue.toString());
  formData.append("StartDate", data.startDate);
  formData.append("EndDate", data.endDate);
  formData.append("UsageLimit", data.usageLimit.toString());

  const response = await request<TResponseData<API.Promotion>>(
    API_ENDPOINTS.PROMOTION_WITH_ID(promotionId),
    {
      method: "PUT",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deletePromotion = async (
  promotionId: string
): Promise<TResponseData<API.Promotion>> => {
  const response = await request<TResponseData<API.Promotion>>(
    API_ENDPOINTS.PROMOTION_WITH_ID(promotionId),
    {
      method: "DELETE",
    }
  );
  return response.data;
};

export const reviewPromotion = async (
  data: REQUEST.ReviewPromotion
): Promise<TResponseData<API.Promotion>> => {
  const response = await request<TResponseData<API.Promotion>>(
    API_ENDPOINTS.REVIEW_PROMOTION,
    {
      method: "POST",
      data: data,
    }
  );
  return response.data;
};

export const participantPromotion = async (
  promotionId: string
): Promise<TResponseData<API.ParticipantPromotion>> => {
  const response = await request<TResponseData<API.ParticipantPromotion>>(
    API_ENDPOINTS.PROMOTION_WITH_ID(promotionId),
    {
      method: "POST",
    }
  );
  return response.data;
};

export const withdrawPromotion = async (
  param: REQUEST.withdrawPromotion
): Promise<TResponseData<API.ParticipantPromotion>> => {
  const formData = new FormData();
  if (param.sellerId != undefined) formData.append("SellerId", param.sellerId);

  formData.append("PromotionId", param.promotionId);
  const response = await request<TResponseData<API.ParticipantPromotion>>(
    API_ENDPOINTS.WITHDRAW_PROMOTION,
    {
      method: "DELETE",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getAllPromotionParticipant = async ({
  promotionId,
  pageIndex,
  pageSize,
  desc,
}: REQUEST.GetPromotionParticipant): Promise<
  TResponseData<API.ViewParticipantPromotion[]>
> => {
  const response = await request<TResponseData<API.ViewParticipantPromotion[]>>(
    API_ENDPOINTS.PROMOTION_PARTICIPANT,
    {
      method: "GET",
      params: {
        promotionId,
        pageIndex,
        pageSize,
        desc,
      },
    }
  );
  return response.data;
};
