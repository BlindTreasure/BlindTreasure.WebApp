import { useMutation } from "@tanstack/react-query";
import { createCategory, deleteCategory, updateCategory } from "@/services/category/api-services";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";

export const useServiceCreateCategory = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<any>, TMeta, REQUEST.CategoryForm>({
    mutationFn: createCategory,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Tạo danh mục thành công!",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Tạo danh mục thất bại. Vui lòng thử lại!",
        duration: 5000,
      });
    },
  });
};

export const useServiceDeleteCategory = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<any>,
    TMeta,
    { categoryId: string }
  >({
    mutationFn: ({ categoryId }) => deleteCategory(categoryId),
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data?.value?.message || "Xóa danh mục thành công!",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Xóa danh mục thất bại. Vui lòng thử lại!",
        duration: 5000,
      });
    },
  });
};

export const useServiceUpdateCategory = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<any>, 
    TMeta, 
    REQUEST.CategoryForm & { categoryId: string }
  >({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Cập nhật danh mục thành công!",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Cập nhật danh mục thất bại. Vui lòng thử lại!",
        duration: 5000,
      });
    },
  });
};