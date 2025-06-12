import { useServiceUpdateBlindBox } from "@/services/blindboxes/services";
import {
  CreateBlindBox,
  CreateBlindBoxBodyType,
} from "@/utils/schema-validations/create-blindbox.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useUpdateBlindboxForm(
  blindboxesId: string,
  defaultValues?: Partial<CreateBlindBoxBodyType>
) {
  const form = useForm<CreateBlindBoxBodyType>({
    resolver: zodResolver(CreateBlindBox),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      imageFile: null,
      totalQuantity: undefined,
      releaseDate: "",
      hasSecretItem: false,
      secretProbability: undefined,
      ...defaultValues,
    },
  });

  const { mutate, isPending } = useServiceUpdateBlindBox();

  const onSubmit = (
    data: CreateBlindBoxBodyType,
    clearImages: () => void,
    onSuccessCallback?: () => void
  ) => {
    mutate(
      {
        blindboxesId,
        form: data,
      },
      {
        onSuccess: () => {
          clearImages();
          onSuccessCallback?.();
        },
        onError: (err) => {
          console.error("Update failed", err);
        },
      }
    );
  };

  return {
    form,
    onSubmit,
    isPending,
  };
}
