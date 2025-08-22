import { useQuery } from "@tanstack/react-query";
import { getAllStatusSeller } from "@/services/seller/api-services";

export const useAdminSellerList = (
  pageIndex = 1,
  pageSize = 50,
  status = undefined
) => {
  return useQuery({
    queryKey: ["admin-seller-list", pageIndex, pageSize, status],
    queryFn: async () => {
      const res = await getAllStatusSeller({ pageIndex, pageSize, status });
      return res.value.data.result;
    },
  });
};
