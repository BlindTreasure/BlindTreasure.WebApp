import useToast from "@/hooks/use-toast";
import { getAllUser } from "@/services/user/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useRef, useState } from "react";

export default function useGetAllUser() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getAllUserApi = useCallback(async (params: REQUEST.GetUsers) => {
    setPending(true);
    try {
      const res = await getAllUser(params);
      if (isTResponseData(res)) {
        return res as TResponseData<API.ResponseDataUser>;
      } else {
        addToast({
          type: "error",
          description: "Có lỗi khi lấy dữ liệu user, vui lòng thử lại sau",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "An error occurred while fetching user",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, [addToast]);

  return { isPending, getAllUserApi };
}
