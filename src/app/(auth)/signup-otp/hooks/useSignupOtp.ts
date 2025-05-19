import { handleError } from "@/hooks/error";
import useToast from "@/hooks/use-toast";
import {
  useServiceResendOtp,
  useServiceVerifyOtp,
} from "@/services/auth/services";
import { setSignupEmail, setSignupOtp } from "@/stores/auth-slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useSignupOtp = () => {
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.authSlice.signup);
  const { addToast } = useToast();
  const [error, setError] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const { mutate, isPending } = useServiceVerifyOtp();
  const { mutate: resendOtpMutate, isPending: isResending } =
    useServiceResendOtp();

  useEffect(() => {
    if (!signupState.email && emailFromUrl) {
      dispatch(setSignupEmail({ email: emailFromUrl, otp: "" }));
    }
  }, [emailFromUrl, signupState.email, dispatch]);

  const handleChange = (value: string) => {
    setValue(value);
  };

  const handleReset = () => {
    setValue("");
    setError("");
  };

  const handleSubmitOtp = (otp: string) => {
    dispatch(
      setSignupOtp({
        email: signupState.email,
        otp: otp,
      })
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.length < 6) return setError("Please enter the full OTP");
    else {
      setError("");
      const data = {
        email: signupState.email,
        otp: value,
      };
      mutate(data, {
        onSuccess: (data) => {
          if (data) {
            handleSubmitOtp(`${data.value.data}`);
            handleReset();
            router.push("/login");
          }
        },
        onError: (error: any) => {
          handleError(error);
        },
      });
    }
  };

  const handleResendOtp = () => {
    if (!signupState.email) {
      return addToast({
        type: "error",
        description: "Không tìm thấy email. Vui lòng quay lại đăng ký.",
      });
    }

    resendOtpMutate(
      {
        Email: signupState.email,
        Type: "Register",
      },
      {
        onError: (error: any) => {
          handleError(error);
        },
      }
    );
  };

  return {
    error,
    value,
    handleChange,
    handleSubmit,
    isPending,
    isResending,
    handleResendOtp,
    setError,
  };
};

export default useSignupOtp;
