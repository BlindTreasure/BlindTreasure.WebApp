import { useServiceCreateBlindbox } from "@/services/blindboxes/services";
import { CreateBlindboxForm } from "@/services/blindboxes/typings";
import {
  CreateBlindBox,
  CreateBlindBoxBodyType,
} from "@/utils/schema-validations/create-blindbox.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useCreateBlindboxForm(
  defaultValues?: Partial<CreateBlindBoxBodyType>
) {
  const {
    register,
    watch,
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateBlindBoxBodyType>({
    resolver: zodResolver(CreateBlindBox),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      price: undefined,
      imageFile: null,
      totalQuantity: undefined,
      releaseDate: "",
      brand: "",
      hasSecretItem: false,
      secretProbability: undefined,
      ...defaultValues,
    },
  });

  const { mutate, isPending } = useServiceCreateBlindbox();

  const onSubmit = async (
    data: CreateBlindboxForm,
    clearImages: () => void,
    onSuccessCallback?: () => void
  ) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        clearImages();
        onSuccessCallback?.();
      },
      onError: (err) => {
        console.error(err);
      },
    });
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
