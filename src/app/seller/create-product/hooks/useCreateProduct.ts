import { Status } from "@/const/products";
import { useServiceCreateProduct } from "@/services/product-seller/services";
import { CreateProductForm } from "@/services/product-seller/typings";
import {
  CreateProductBody,
  CreateProductBodyType,
} from "@/utils/schema-validations/create-product.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useCreateProductForm(
  defaultValues?: Partial<CreateProductBodyType>
) {
  const {
    register,
    watch,
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      price: undefined,
      stock: undefined,
      status: Status.Active,
      height: undefined,
      material: "",
      productType: null,
      brand: "",
      images: [],
      ...defaultValues,
    },
  });

  const { mutate, isPending } = useServiceCreateProduct();

  const onSubmit = (data: CreateProductForm, clearImages: () => void) => {
    try {
      mutate(data, {
        onSuccess: () => {
          reset();
          clearImages();
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    register,
    handleSubmit,
    control,
    onSubmit,
    watch,
    errors,
    setError,
    setValue,
    isPending,
    reset,
  };
}
