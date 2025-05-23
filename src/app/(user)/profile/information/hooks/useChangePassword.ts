import {
    useServiceChangePassword,
  } from "@/services/account/services";
  import {
    ChangePasswordBody,
    ChangePasswordBodyType,
  } from "@/utils/schema-validations/change-password.schema";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useForm } from "react-hook-form";
  
  export default function useChangePassword() {
    const {
      register,
      watch,
      handleSubmit,
      setError,
      formState: { errors },
      reset,
    } = useForm<ChangePasswordBodyType>({
      resolver: zodResolver(ChangePasswordBody),
      defaultValues: {
        password: "",
        confirmPassword: "",
      },
    });
  
    const { mutate, isPending } = useServiceChangePassword();
  
    const onSubmit = (request: REQUEST.TChangePassword, onClose: () => void) => {
      try {
        mutate(request, {
          onSuccess: async () => {
            onClose();
          },
          onError: (error) => {
            if (error.errorCode === "account_noti_08") {
              setError("password", {
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
  