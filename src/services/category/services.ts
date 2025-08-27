import { useMutation } from "@tanstack/react-query";
import { createCategory, deleteCategory, updateCategory } from "@/services/category/api-services";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";

export const useServiceCreateCategory = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.ResponseDataCategory>, Error, REQUEST.CategoryForm>({
    mutationFn: createCategory,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useServiceDeleteCategory = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<any>,
    Error,
    { categoryId: string }
  >({
    mutationFn: ({ categoryId }) => deleteCategory(categoryId),
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data?.value?.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useServiceUpdateCategory = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<any>, 
    Error, 
    REQUEST.CategoryForm & { categoryId: string }
  >({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};