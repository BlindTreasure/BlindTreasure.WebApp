import { useServiceAddress } from "@/services/account/services";
import {
  createAddressSchema,
  TCreateAddressSchema,
} from "@/utils/schema-validations/address.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useCreateAddress(
  defaultValues?: Partial<TCreateAddressSchema>
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
  } = useForm<TCreateAddressSchema>({
    resolver: zodResolver(createAddressSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      province: "",
      postalCode: "",
      isDefault: false,
      ...defaultValues,
    },
  });

  const { mutate, isPending } = useServiceAddress();

  const onSubmit = (data: TCreateAddressSchema, onSuccess?: () => void) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
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
