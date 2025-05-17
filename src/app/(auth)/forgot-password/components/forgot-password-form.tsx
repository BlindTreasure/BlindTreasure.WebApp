"use client";
import ForgotPasswordChange from "@/app/(auth)/forgot-password/components/forgot-password-change";
import ForgotPasswordSendMail from "@/app/(auth)/forgot-password/components/forgot-password-sendmail";
import {
  resetForgotPasswordEmail,
} from "@/stores/auth-slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordForm() {
  const dispatch = useAppDispatch();
  const forgotPasswordState = useAppSelector(
    (state) => state.authSlice.forgotPassword
  );

  const handlePrevious = () => {
    dispatch(resetForgotPasswordEmail());
  };

  return (
    <div className="w-[70%] px-5 py-4 m-auto">
      <div className="flex flex-col gap-y-4">
        {forgotPasswordState.email?.length > 0 && (
          <div onClick={handlePrevious}>
            <div className="inline-flex p-2 bg-slate-200 rounded-full hover:bg-slate-300 cursor-pointer">
              <ChevronLeft />
            </div>
          </div>
        )}
        {forgotPasswordState.email?.length > 0 ? (
          <ForgotPasswordChange />
        ) : (
          <ForgotPasswordSendMail />
        )}
      </div>
    </div>
  );
}
