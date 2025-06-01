import useToast from "@/hooks/use-toast";
import { createCategory } from "@/services/category/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useCreateCategory() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const createCategoryApi = useCallback(async (data: REQUEST.CategoryInfo) => {
    setPending(true);
    try {
      const res = await createCategory(data);
      if (isTResponseData(res)) {
        addToast({
          type: "success",
          description: res.value.message || "Tạo danh mục thành công!",
        });
        return res as TResponseData<any>;
      } else {
        addToast({
          type: "error",
          description: "Tạo danh mục thất bại!",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "Đã xảy ra lỗi khi tạo danh mục.",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, [addToast]);

  return { isPending, createCategoryApi };
}
