import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/category/api-path";

export const getAllCategory = async ({
  search,
  pageIndex,
  pageSize,
}: REQUEST.GetCategory): Promise<TResponseData<API.ResponseDataCategory>> => {
  const response = await request<TResponseData<API.ResponseDataCategory>>(
    API_ENDPOINTS.CATEGORY,
    {
      method: "GET",
      params: {
        search,
        pageIndex,
        pageSize,
      },
    }
  );
  return response.data;
};

export const createCategory = async (
  data: REQUEST.CategoryForm
): Promise<TResponseData<API.ResponseDataCategory>> => {
  const formData = new FormData();
  formData.append("Name", data.name);
  formData.append("Description", data.description);

  if (data.imageUrl instanceof File) {
    formData.append("ImageFile", data.imageUrl);
  }
  if (
    data.parentId !== undefined &&
    data.parentId !== null &&
    data.parentId !== ""
  ) {
    formData.append("ParentId", String(data.parentId));
  }

  const response = await request<TResponseData<API.ResponseDataCategory>>(
    API_ENDPOINTS.CATEGORY,
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

export const updateCategory = async (
  payload: REQUEST.CategoryForm & { categoryId: string }
): Promise<TResponseData<API.ResponseDataCategory>> => {
  const { categoryId, ...data } = payload;

  const formData = new FormData();
  formData.append("Name", data.name);
  formData.append("Description", data.description);

  if (data.imageUrl instanceof File) {
    formData.append("ImageFile", data.imageUrl);
  }
  if (
    data.parentId !== undefined &&
    data.parentId !== null &&
    data.parentId !== ""
  ) {
    formData.append("ParentId", String(data.parentId));
  }

  const response = await request<TResponseData<API.ResponseDataCategory>>(
    API_ENDPOINTS.CATEGORY_WITH_ID(categoryId),
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

export const deleteCategory = async (categoryId: string) => {
  const response = await request<TResponseData<API.ResponseDataCategory>>(
    API_ENDPOINTS.CATEGORY_WITH_ID(categoryId),
    {
      method: "DELETE",
    }
  );
  return response.data;
};

export const getCategoryById = async (categoryId: string) => {
  const response = await request<TResponseData<API.ResponseDataCategory>>(
    API_ENDPOINTS.CATEGORY_WITH_ID(categoryId),
    {
      method: "GET",
    }
  );
  return response.data;
};
