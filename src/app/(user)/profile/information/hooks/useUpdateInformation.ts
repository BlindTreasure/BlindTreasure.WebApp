import { useServiceUpdateInfoProfile } from "@/services/account/services";
import {
  UpdateInfoProfileBody,
  UpdateInfoProfileBodyType,
} from "@/utils/schema-validations/update-infor-profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useUpdateInformation({
  fullName,
  email,
  phoneNumber,
  gender,
}: Readonly<{
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: boolean | null
}>) {
  const {
    register,
    watch,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UpdateInfoProfileBodyType>({
    resolver: zodResolver(UpdateInfoProfileBody),
    defaultValues: {
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      gender: gender
    },
  });

  const { mutate, isPending } = useServiceUpdateInfoProfile();

  const onSubmit = (
    request: REQUEST.TUpdateInfoProfile,
    onClose: () => void,
    fetchProfileApi: () => void
  ) => {
    try {
      mutate(request, {
        onSuccess: async () => {
          onClose();
          fetchProfileApi();
        },
      });
    } catch (err) {}
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    mutate,
    reset,
    isPending,
    watch,
    setValue,
  };
}