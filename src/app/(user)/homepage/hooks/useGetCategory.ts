import useToast from "@/hooks/use-toast";
import { getAllCategory } from "@/services/category/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetCategory() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getCategoryApi = useCallback(async (params: REQUEST.GetCategory) => {
    setPending(true);
    try {
      const res = await getAllCategory(params);
      if (isTResponseData(res)) {
        return res as TResponseData<API.ResponseDataCategory>;
      } else {
        addToast({
          type: "error",
          description: "Failed to fetch category",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "An error occurred while fetching category",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, [addToast]);

  return { isPending, getCategoryApi };
}
