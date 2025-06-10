import { Status } from "@/const/products";
import {
  useServiceUpdateImageProduct,
} from "@/services/product-seller/services";
import {
  UpdateProductImages,
  UpdateProductImagesType,
} from "@/utils/schema-validations/create-product.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useUpdateImageProductForm(
  productId: string,
  defaultValues?: Partial<UpdateProductImagesType>
) {
  const form = useForm<UpdateProductImagesType>({
    resolver: zodResolver(UpdateProductImages),
    defaultValues: {
      images: [],
      ...defaultValues,
    },
  });

  const { mutate, isPending } = useServiceUpdateImageProduct();

   const onSubmit = (
    data: UpdateProductImagesType,
    clearImages: () => void,
    onSuccessCallback?: (newImageUrls: string[]) => void
  ) => {
    try {
      const newImages = data.images?.filter((img): img is File => img instanceof File) || [];
      if (newImages.length > 0) {
        mutate(
          {
            productId,
            images: newImages,
          },
          {
            onSuccess: (response) => {
              const newImageUrls = response.value.data.imageUrls || [];
              clearImages();
              if (onSuccessCallback) onSuccessCallback(newImageUrls);
            },
          }
        );
      } else {
        clearImages();
        if (onSuccessCallback) onSuccessCallback([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    form,
    onSubmit,
    isPending,
  };
}
