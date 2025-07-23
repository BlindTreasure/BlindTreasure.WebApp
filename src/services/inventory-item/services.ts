import useToast from "@/hooks/use-toast";
import { PreviewShipment, RequestShipment, ShipmentPreview } from "./typings";
import { previewShipment, requestShipment } from "./api-services";
import { handleError } from "@/hooks/error";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Custom error handler for shipping services
const handleShippingError = (error: any, router: any) => {
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

export const useServiceRequestShipment = () => {
  const { addToast } = useToast();
  const router = useRouter();

  return useMutation<TResponseData<ShipmentPreview[]>, Error, RequestShipment>({
    mutationFn: async (data: RequestShipment) => {
      return await requestShipment(data);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleShippingError(error, router);
    },
  });
};

export const useServicePreviewShipment = () => {
  const { addToast } = useToast();
  const router = useRouter();

  return useMutation<TResponseData<ShipmentPreview[]>, Error, PreviewShipment>({
    mutationFn: async (data: PreviewShipment) => {
      return await previewShipment(data);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleShippingError(error, router);
    },
  });
};
