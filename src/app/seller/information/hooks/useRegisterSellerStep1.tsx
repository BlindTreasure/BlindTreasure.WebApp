// hooks/useRegisterSellerStep1.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSellerStep1Schema,
  RegisterSellerStep1Type,
} from "@/utils/schema-validations/seller.schema";
import { useServiceUpdateSellerProfile } from "@/services/account/services";

export default function useRegisterSellerStep1(defaultValues?: Partial<RegisterSellerStep1Type>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
    watch,
    setValue,
  } = useForm<RegisterSellerStep1Type>({
    resolver: zodResolver(RegisterSellerStep1Schema),
    defaultValues,
  });

  const { mutate, isPending, isSuccess } = useServiceUpdateSellerProfile();

  const onSubmit = (data: RegisterSellerStep1Type, onSuccessCallback: () => void) => {
    const formattedData = {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth).toISOString(),
    };
    mutate(formattedData, {
      onSuccess: () => {
        onSuccessCallback();
      },
      onError: (error: any) => {
        console.error("Lỗi khi gửi form:", error);
      },
    });
  };

  const submitStep1 = (onSuccessCallback: () => void) =>
    handleSubmit((data) => onSubmit(data, onSuccessCallback))();

  return {
    register,
    errors,
    submitStep1,
    isSubmitting,
    isPending,
    isSuccess,
    reset,
    watch,
    setValue,
  };
}
