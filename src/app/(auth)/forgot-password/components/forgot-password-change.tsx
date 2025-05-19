import InputAuth from "@/components/input-auth";
import Link from "next/link";
import useForgotPasswordChange from "@/app/(auth)/forgot-password/hooks/useForgotPasswordChange";
import { Backdrop } from "@/components/backdrop";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function ForgotPasswordChange() {
  const {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isPending,
    typePassword,
    typeConfirmPassword,
    valuePassword,
    valueConfirmPassword,
    handleToggleTypePassword,
    handleToggleTypeConfirmPassword,
    otpValue,
    handleOtpChange,
    otpError,
    isResending,
    handleResendOtp,
  } = useForgotPasswordChange();

  const renderListOtp = () => {
    return (
      <InputOTP maxLength={6} value={otpValue} onChange={handleOtpChange}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot index={4} />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    );
  };

  return (
    <div className="w-[100%]">
      <h2 className="text-[1.5rem] leading-8 font-medium">Quên mật khẩu</h2>
      <span className="text-gray-500 inline-block mt-2">
        Nhập mã OTP và mật khẩu mới để hoàn tất quá trình khôi phục!
      </span>
      <form
        className="pt-5 flex flex-col gap-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-medium">Mã OTP</label>
          <div className="flex gap-x-4">{renderListOtp()}</div>
          {otpError && <p className="text-sm text-red-500">{otpError}</p>}
        </div>

        <div className="flex flex-col gap-y-2">
          <InputAuth
            id="password"
            label="Mật khẩu mới"
            type={typePassword ? "text" : "password"}
            autoComplete="off"
            register={register("password")}
            error={errors?.password?.message}
            value={valuePassword}
            onClickEyePassword={handleToggleTypePassword}
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <InputAuth
            id="confirmpassword"
            label="Xác nhận mật khẩu"
            type={typeConfirmPassword ? "text" : "password"}
            autoComplete="off"
            register={register("confirmPassword")}
            error={errors?.confirmPassword?.message}
            value={valueConfirmPassword}
            onClickEyePassword={handleToggleTypeConfirmPassword}
          />
        </div>

        <div className="flex flex-col gap-y-5">
          <button
            type="submit"
            className={`mt-2 block w-[100%] rounded-md py-2 ${otpValue?.length === 6 &&
              valuePassword &&
              valueConfirmPassword
              ? "bg-[#7a3cdd]"
              : "bg-[#C3B1E1]"
              }`}
          >
            <span className="text-base text-gray-200">Xác nhận</span>
          </button>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending || isPending}
            className={`mt-1 underline text-[#7a3cdd] text-center ${isResending ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
          >
            {isResending ? "Đang gửi lại OTP..." : "Gửi lại mã OTP"}
          </button>
          <div className="flex items-center justify-between gap-3">
            <div
              className={`w-[50%] h-1 rounded-full ${otpValue?.length === 6 &&
                valuePassword &&
                valueConfirmPassword
                ? "bg-[#7a3cdd]"
                : "bg-[#C3B1E1]"
                }`}
            ></div>
            <div
              className={`w-[50%] h-1 rounded-full ${otpValue?.length === 6 &&
                valuePassword &&
                valueConfirmPassword
                ? "bg-[#7a3cdd]"
                : "bg-[#C3B1E1]"
                }`}
            ></div>
          </div>

          <div className="flex justify-between">
            <p className="text-[1rem]">
              Bạn có tài khoản?{" "}
              <Link href="/login">
                <span className="font-bold cursor-pointer">Đăng nhập</span>
              </Link>
            </p>
          </div>
        </div>
      </form>
      <Backdrop open={isPending || isResending} />
    </div>
  );
}