import useToast from "@/hooks/use-toast";
import { getCategoryById } from "@/services/category/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetCategoryById() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getCategoryByIdApi = useCallback(async (categoryId: string) => {
    setPending(true);
    try {
      const res = await getCategoryById(categoryId);
      if (isTResponseData(res)) {
        return res as TResponseData<any>;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  }, [addToast]);

  return { isPending, getCategoryByIdApi };
}
