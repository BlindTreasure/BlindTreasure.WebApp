import useToast from "@/hooks/use-toast";
import { useServiceForgotPasswordEmail } from "@/services/auth/services";
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
  const forgotPasswordState = useAppSelector(
    (state) => state.authSlice.forgotPassword
  );
  const { mutate, isPending } = useServiceForgotPasswordEmail();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordEmailBodyType>({
    resolver: zodResolver(ForgotPasswordEmailBody),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordEmailBodyType) => {
    try {
      mutate(data, {
        onSuccess: async () => {
          dispatch(
            setForgotPasswordEmail({
              email: data.email,
            })
          );

          reset();
        },
        onError: (error: any) => {
          const data = error?.response?.data || error;
          if (data?.error?.code === "400") {
            addToast({
              type: "error",
              description: data.error.message,
              duration: 5000,
            });
          }
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isPending,
  };
}
