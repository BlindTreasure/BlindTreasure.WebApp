import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { CreateProductForm, Product } from "./typings";
import { CreateProductBodyType } from "@/utils/schema-validations/create-product.schema";
import { createProduct } from "./api-services";

export const useServiceCreateProduct = () => {
  const { addToast } = useToast();

  return useMutation<TResponse, Error, CreateProductForm>({
    mutationFn: async (data: CreateProductForm) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("categoryId", data.categoryId);
      formData.append("price", data.price.toString());
      formData.append("stock", data.stock.toString());
      formData.append("status", data.status);
      
      if (data.height !== undefined)
        formData.append("height", data.height.toString());
      if (data.material) formData.append("material", data.material);
      if (data.productType !== undefined && data.productType !== null)
        formData.append("productType", data.productType);
      if (data.brand) formData.append("brand", data.brand);
      if (data.productImageUrl)
        formData.append("productImageUrl", data.productImageUrl);

      return await createProduct(formData);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};
