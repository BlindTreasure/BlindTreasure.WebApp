import request from "@/components/interceptor";
import API_ENDPOINTS from "@/services/product-seller/api-path";
import { GetProduct, Product, TProductResponse, UpdateInfor } from "./typings";

export const getAllProductSeller = async ({
  search,
  categoryId,
  status,
  sortBy,
  desc,
  pageIndex,
  pageSize,
}: GetProduct): Promise<TResponseData<TProductResponse>> => {
  const response = await request<TResponseData<TProductResponse>>(
    API_ENDPOINTS.PRODUCT,
    {
      method: "GET",
      params: {
        search,
        categoryId,
        status,
        sortBy,
        desc,
        pageIndex,
        pageSize,
      },
    }
  );
  return response.data;
};

export const createProduct = async (body: FormData) => {
  const response = await request<TResponseData<Product>>(
    API_ENDPOINTS.PRODUCT,
    {
      method: "POST",
      data: body,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateProduct = async (
  body: UpdateInfor & { productId: string }
): Promise<TResponseData<Product>> => {
  const { productId, ...data } = body;

  const response = await request<TResponseData<Product>>(
    API_ENDPOINTS.PRODUCT_WITH_ID(productId),
    {
      method: "PUT",
      data,
    }
  );

  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await request<TResponseData<Product>>(
    API_ENDPOINTS.PRODUCT_WITH_ID(productId),
    {
      method: "DELETE",
    }
  );
  return response.data;
};


export const updateImageProduct = async (productId: string, body: FormData) => {
  const response = await request<TResponseData<Product>>(
    API_ENDPOINTS.UPDATE_IMAGE(productId),
    {
      method: "PUT",
      data: body,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};