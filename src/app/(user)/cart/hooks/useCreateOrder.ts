import useToast from "@/hooks/use-toast";
import { OrderService } from "@/services/stripe/services";
import { useState } from "react";

export default function useCreateOrder() {
  const [isPending, setPending] = useState(false);
  const { addToast } = useToast();

  const create = async (data: REQUEST.CreateOrderList): Promise<string | null> => {
    setPending(true);
    try {
      const url = await OrderService.createOrder(data);
      return url;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { createOrder: create, isPending };
}
