import useToast from "@/hooks/use-toast";
import { deleteCategory } from "@/services/category/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useDeleteCategory() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const deleteCategoryApi = useCallback(async (categoryId: string) => {
    setPending(true);
    try {
      const res = await deleteCategory(categoryId);
      if (isTResponseData(res)) {
        addToast({
          type: "success",
          description: res.value.message || "Xóa danh mục thành công!",
        });
        return res as TResponseData<any>;
      } else {
        addToast({
          type: "error",
          description: "Xóa danh mục thất bại!",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "Đã xảy ra lỗi khi xóa danh mục.",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, [addToast]);

  return { isPending, deleteCategoryApi };
}
