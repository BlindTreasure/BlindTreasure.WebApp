import useToast from "@/hooks/use-toast";
import { createGroupPaymentLink, createOrder, previewShipping } from "./api-services";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "@/hooks/error";
import { useRouter } from "next/navigation";

const handleCartShippingError = (error: any, router: any) => {
  const data = error?.response?.data || error;
  const codeRaw = data?.error?.code;
  const code = Number(codeRaw);

  handleError(error);

  if (code === 400) {
    setTimeout(() => {
      router.push("/address-list");
    }, 1500);
  }
};

export const OrderService = {
  createOrder: async (data: REQUEST.CreateOrderList): Promise<string> => {
    try {
      const response = await createOrder(data);
      if (response.isSuccess) {
        return response.value.data.generalPaymentUrl;
      } else {
        throw new Error(response.error.message || "Tạo đơn hàng thất bại");
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};

export const useServicePreviewShipping = () => {
  const { addToast } = useToast();
  const router = useRouter();

  return useMutation<
    TResponseData<API.ShipmentPreview[]>,
    Error,
    REQUEST.CreateOrderList
  >({
    mutationFn: async (data: REQUEST.CreateOrderList) => {
      return await previewShipping(data);
    },
    onSuccess: (data) => {},
    onError: (error) => {
      handleCartShippingError(error, router);
    },
  });
};

export const useServiceCreateGroupPaymentLink = () => { 
  const { addToast } = useToast();

  return useMutation<TResponseData<any>, Error, REQUEST.CreateGroupPaymentLink>({
    mutationFn: async (data: REQUEST.CreateGroupPaymentLink) => {
      return await createGroupPaymentLink(data);
    },
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
