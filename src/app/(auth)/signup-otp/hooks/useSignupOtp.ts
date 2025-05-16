import useToast from "@/hooks/use-toast";
import { useServiceVerifyOtp } from "@/services/auth/services";
import {
  setSignupOtp,
} from "@/stores/auth-slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { useState } from "react";

const useSignupOtp = () => {
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.authSlice.signup);
  const { addToast } = useToast();
  const [error, setError] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const { mutate, isPending } = useServiceVerifyOtp();

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
          }
        },
        onError: (error) => {
          if (error.errorCode.includes("auth_otp")) {
            setError(error.detail);
          } else {
            addToast({
              type: "error",
              description: "OTP verification failed. Please try again.",
            });
          }
        },
      });
    }
  };

  return {
    error,
    value,
    handleChange,
    handleSubmit,
    isPending,
    setError,
  };
};

export default useSignupOtp;
