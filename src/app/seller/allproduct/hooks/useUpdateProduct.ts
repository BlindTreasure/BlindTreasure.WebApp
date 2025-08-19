import { Status } from "@/const/products";
import { useServiceUpdateProduct } from "@/services/product-seller/services";
import { CreateProductForm } from "@/services/product-seller/typings";
import {
  CreateProductBody,
  CreateProductBodyType,
} from "@/utils/schema-validations/create-product.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useUpdateProductForm(
  productId: string,
  initialData?: CreateProductBodyType
) {
  const {
    register,
    watch,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: initialData ?? {
      name: "",
      description: "",
      categoryId: "",
      realSellingPrice: undefined,
      listedPrice: null,
      totalStockQuantity: undefined,
      status: Status.Active,
      height: undefined,
      material: "",
      productType: null,
      // brand: "",
      images: [],
    },
  });

  const { mutate, isPending } = useServiceUpdateProduct();

  const onSubmit = (
    data: CreateProductForm,
    clearImages: () => void,
    onSuccessCallback?: () => void
  ) => {
    try {
      mutate(
        { ...data, productId },
        {
          onSuccess: () => {
            clearImages();
            if (onSuccessCallback) onSuccessCallback();
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    watch,
    errors,
    setError,
    setValue,
    isPending,
    reset,
  };
}
