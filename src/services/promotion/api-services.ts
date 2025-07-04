import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/promotion/api-path";

export const getAllPromotion = async ({
  status,
  sellerId,
  pageIndex,
  pageSize,
}: REQUEST.GetPromotion): Promise<TResponseData<API.ResponseDataPromotion>> => {
  const response = await request<TResponseData<API.ResponseDataPromotion>>(
    API_ENDPOINTS.PROMOTION,
    {
      method: "GET",
      params: {
        status,
        sellerId,
        pageIndex,
        pageSize,
      },
    }
  );
  return response.data;
};

export const getPromotionById = async (promotionId : string): Promise<TResponseData<API.Promotion>> => {
  const response = await request<TResponseData<API.Promotion>>(
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
  payload: REQUEST.PromotionForm & { promotionId: string}
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
      method: "DELETE"
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
      data: data
    }
  );
  return response.data;
};