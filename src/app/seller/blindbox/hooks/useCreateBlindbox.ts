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

  const onSubmit = (data: CreateBlindboxForm, clearImages: () => void) => {
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
