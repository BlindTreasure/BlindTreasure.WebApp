import { useServiceUpdateCategory } from "@/services/category/services";
import { useCallback } from "react";

export default function useUpdateCategory() {
  const mutation = useServiceUpdateCategory();

  const updateCategoryApi = useCallback(async (id: string, data: REQUEST.CategoryInfo) => {
    try {
      const result = await mutation.mutateAsync({
        ...data,
        categoryId: id
      });
      return result;
    } catch (error) {
      return null;
    }
  }, [mutation]);

  return { 
    isPending: mutation.isPending, 
    updateCategoryApi 
  };
}