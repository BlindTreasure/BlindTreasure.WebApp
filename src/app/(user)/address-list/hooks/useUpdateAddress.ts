import { useServicesUpdateAddress } from "@/services/account/services";
import {
  createAddressSchema,
  TCreateAddressSchema,
} from "@/utils/schema-validations/address.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useUpdateAddress(
  defaultValues?: Partial<TCreateAddressSchema> & { addressId: string }
) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors },
    reset,
  } = useForm<TCreateAddressSchema>({
    resolver: zodResolver(createAddressSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      addressLine1: "",
      city: "",
      province: "",
      postalCode: "",
      ...defaultValues,
    },
  });

  const { mutate, isPending } = useServicesUpdateAddress();

  const onSubmit = (data: TCreateAddressSchema, onSuccess?: () => void) => {
    if (!defaultValues?.addressId) return;

    const {
      fullName,
      phone,
      addressLine1,
      city,
      province,
      postalCode,
    } = data;

    mutate(
      {
        addressId: defaultValues.addressId,
        fullName,
        phone,
        addressLine1,
        city,
        province,
        postalCode,
      },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      }
    );
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
