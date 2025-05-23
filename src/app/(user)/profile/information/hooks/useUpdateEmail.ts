import { useServiceUpdateEmailProfile } from "@/services/account/services";
import {
  UpdateEmailBody,
  UpdateEmailBodyType,
} from "@/utils/schema-validations/update-email-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useUpdateEmail({
  email,
}: Readonly<{
  email: string;
}>) {
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<UpdateEmailBodyType>({
    resolver: zodResolver(UpdateEmailBody),
    defaultValues: {
      email: email,
    },
  });

  const { mutate, isPending } = useServiceUpdateEmailProfile();

  const onSubmit = (request: REQUEST.TUpdateEmail, onClose: () => void) => {
    try {
      mutate(request, {
        onSuccess: async () => {
          onClose();
        },
        onError: (error) => {
          if (error.errorCode === "account_email_01") {
            setError("email", {
              message: error.detail,
            });
          }
          if (error.errorCode === "account_email_02") {
            setError("email", {
              message: error.detail,
            });
          }
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
