import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/review/api-path";
import {
  ReviewCreateRequest,
  ReviewResponse,
  ReviewListResponse,
  ReviewGetRequest,
} from "./typings";

export const createReview = async (
  body: ReviewCreateRequest
): Promise<TResponseData<ReviewResponse>> => {
  const formData = new FormData();
  formData.append("orderDetailId", body.orderDetailId);
  formData.append("rating", body.rating.toString());
  formData.append("comment", body.comment);
  if (body.images && body.images.length > 0) {
    body.images.forEach((file) => {
      formData.append(`images`, file);
    });
  }

  const response = await request<TResponseData<ReviewResponse>>(
    API_ENDPOINTS.REVIEW_CREATE,
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

export const getAllReviews = async (params?: {
  pageIndex?: number;
  pageSize?: number;
}): Promise<TResponseData<ReviewListResponse>> => {
  const response = await request<TResponseData<ReviewListResponse>>(
    API_ENDPOINTS.REVIEW,
    {
      method: "GET",
      params,
    }
  );
  return response.data;
};

export const canReview = async (
  orderDetailId: string
): Promise<TResponseData<{ canReview: boolean }>> => {
  const response = await request<TResponseData<{ canReview: boolean }>>(
    API_ENDPOINTS.REVIEW_CAN_REVIEW(orderDetailId),
    {
      method: "GET",
    }
  );
  return response.data;
};

export const getReview = async ({
  ProductId,
  BlindBoxId,
  SellerId,
  MinRating,
  MaxRating,
  HasComment,
  HasImage,
  PageIndex,
  PageSize,
}: ReviewGetRequest): Promise<TResponseData<ReviewListResponse>> => {
  const response = await request<TResponseData<ReviewListResponse>>(
    API_ENDPOINTS.GET_REVIEW,
    {
      method: "GET",
      params: {
        ProductId,
        BlindBoxId,
        SellerId,
        MinRating,
        MaxRating,
        HasComment,
        HasImage,
        PageIndex,
        PageSize,
      },
    }
  );
  return response.data;
};

export const deleteReview = async (reviewId: string): Promise<TResponse> => {
  const response = await request<TResponse>(
    API_ENDPOINTS.DELETE_REVIEW(reviewId),
    {
      method: "DELETE",
    }
  );
  return response.data;
};
