import { useServiceUpdateInfoProfile } from "@/services/account/services";
import {
  UpdateInfoProfileBody,
  UpdateInfoProfileBodyType,
} from "@/utils/schema-validations/update-infor-profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useUpdateInformation({
  firstName,
  lastName,
  phoneNumber,
}: Readonly<{
  firstName: string;
  lastName: string;
  phoneNumber: string;
}>) {
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<UpdateInfoProfileBodyType>({
    resolver: zodResolver(UpdateInfoProfileBody),
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
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
  };
}
