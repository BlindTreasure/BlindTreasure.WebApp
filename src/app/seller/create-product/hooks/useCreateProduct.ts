import { Status } from "@/const/products";
import { useServiceCreateProduct } from "@/services/product/services";
import { CreateProductForm } from "@/services/product/typings";
import {
  CreateProductBody,
  CreateProductBodyType,
} from "@/utils/schema-validations/create-product.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useCreateProductForm() {
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
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      price: 0,
      stock: 0,
      status: Status.Active,
      height: undefined,
      material: "",
      productType: null,
      brand: "",
      productImageUrl: undefined,
    },
  });

  const { mutate, isPending } = useServiceCreateProduct();

  const onSubmit = (data: CreateProductForm, clearImages: () => void) => {
    console.log("data",data);
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
    onSubmit,
    watch,
    errors,
    setError,
    setValue,
    isPending,
    reset,
  };
}
