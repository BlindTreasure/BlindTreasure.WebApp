import request from "@/services/interceptor";
import { AllProduct, GetAllProducts, TAllProductResponse } from "./typings";
import API_ENDPOINTS from "@/services/product/api-path";

export const getAllProduct = async ({
  search,
  categoryId,
  productStatus,
  sellerId,
  sortBy,
  minPrice,
  maxPrice,
  releaseDateFrom,
  releaseDateTo,
  desc,
  pageIndex,
  pageSize,
}: GetAllProducts): Promise<TResponseData<TAllProductResponse>> => {
  const response = await request<TResponseData<TAllProductResponse>>(
    API_ENDPOINTS.PRODUCT_All,
    {
      method: "GET",
      params: {
        search,
        categoryId,
        productStatus,
        sellerId,
        sortBy,
        minPrice,
        maxPrice,
        releaseDateFrom,
        releaseDateTo,
        desc,
        pageIndex,
        pageSize,
      },
    }
  );
  return response.data;
};

export const getProductById = async (
  productId: string
): Promise<TResponseData<AllProduct>> => {
  const response = await request<TResponseData<AllProduct>>(
    API_ENDPOINTS.PRODUCT_ALL_WITH_ID(productId),
    {
      method: "GET",
    }
  );
  return response.data;
};
