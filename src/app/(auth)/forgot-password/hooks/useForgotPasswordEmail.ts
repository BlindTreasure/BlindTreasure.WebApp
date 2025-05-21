import { handleError } from "@/hooks/error";
import useToast from "@/hooks/use-toast";
import {
  useServiceForgotPasswordEmail,
  useServiceResendOtp,
} from "@/services/auth/services";
import { setForgotPasswordEmail } from "@/stores/auth-slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import {
  ForgotPasswordEmailBody,
  ForgotPasswordEmailBodyType,
} from "@/utils/schema-validations/forgot-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useForgotPasswordEmail() {
  const dispatch = useAppDispatch();
  const { mutate: resendOtpMutate, isPending } = useServiceResendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordEmailBodyType>({
    resolver: zodResolver(ForgotPasswordEmailBody),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordEmailBodyType) => {
    resendOtpMutate(
      {
        Email: data.email,
        Type: "ForgotPassword",
      },
      {
        onSuccess: () => {
          dispatch(setForgotPasswordEmail({ email: data.email }));
        },
      }
    );
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isPending,
  };
}
