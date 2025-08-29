import { isTResponseData } from "@/utils/compare";
import { useState } from "react";
import useToast from "@/hooks/use-toast";
import {
  getTransactionsByAdmin,
} from "@/services/admin/api-services";
import {
  StripeTransactionResponse,
  TransactionsParams,
} from "@/services/admin/typings";

export default function useGetTransactionByAdmin() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getTransactionByAdminApi = async (params?: TransactionsParams) => {
    setPending(true);
    try {
      const res = await getTransactionsByAdmin(params);
      if (isTResponseData(res)) {
        return res as TResponseData<StripeTransactionResponse>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getTransactionByAdminApi };
}
