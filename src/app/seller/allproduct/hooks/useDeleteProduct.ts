import { useServiceDeleteProduct } from "@/services/product/services";

export default function useDeleteProduct() {
  const { mutate, isPending } = useServiceDeleteProduct();

  const onDelete = (productId: string, onSuccessCallback?: () => void) => {
    try {
      mutate(productId, {
        onSuccess: () => {
          if (onSuccessCallback) {
            onSuccessCallback();
          }
        },
      });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return {
    onDelete,
    isPending,
  };
}