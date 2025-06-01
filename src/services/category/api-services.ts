import request from "@/components/interceptor";
import API_ENDPOINTS from "@/services/category/api-path";

export const getAllCategory = async ({
  pageIndex,
  pageSize,
}: REQUEST.GetCategory): Promise<TResponseData<API.ResponseDataCategory>> => {
  const response = await request<TResponseData<API.ResponseDataCategory>>(
    API_ENDPOINTS.CATEGORY,
    {
      method: "GET",
      params: {
        pageIndex,
        pageSize,
      },
    }
  );
  return response.data;
};

export const createCategory = async (
  data: REQUEST.CategoryInfo
): Promise<TResponseData<API.ResponseDataCategory>> => {
  const response = await request<TResponseData<API.ResponseDataCategory>>(API_ENDPOINTS.CATEGORY, {
    method: "POST",
    data,
  });
  return response.data;
};

export const deleteCategory = async (categoryId: string) => {
  const response = await request<TResponseData<API.ResponseDataCategory>>(API_ENDPOINTS.CATEGORY_WITH_ID(categoryId), {
    method: "DELETE",
  });
  return response.data;
};

export const getCategoryById = async (categoryId: string) => {
  const response = await request<TResponseData<API.ResponseDataCategory>>(API_ENDPOINTS.CATEGORY_WITH_ID(categoryId), {
    method: "GET",
  });
  return response.data;
};

export const updateCategory = async (
  payload: REQUEST.CategoryInfo & { categoryId: string }
): Promise<TResponseData<API.ResponseDataCategory>> => {
  const { categoryId, ...data } = payload;
  
  const response = await request<TResponseData<API.ResponseDataCategory>>(
    API_ENDPOINTS.CATEGORY_WITH_ID(categoryId), 
    {
      method: "PUT",
      data,
    }
  );
  return response.data;
};