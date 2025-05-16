'use client'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { Backdrop } from "@/components/backdrop";
import useSignupOtp from "../hooks/useSignupOtp";

export default function SignupOtp() {
  const { error, value, handleChange, handleSubmit, isPending } =
    useSignupOtp();

  const renderListOtp = () => {
    return (
      <InputOTP maxLength={6} value={value} onChange={handleChange}>
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
    <div className="w-[80%] px-5 py-4 pt-10 m-auto">
      <h2 className="text-[1.5rem] font-medium">Xác thực OTP</h2>
      <span className="text-gray-500 inline-block mt-2">
        Mã OTP đã được gửi tới email của bạn, vui lòng nhập để xác nhận tài khoản!
      </span>
      <form className="pt-5 flex flex-col gap-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-4">{renderListOtp()}</div>
          {error && <p className="text-base text-red-400">{error}</p>}
        </div>
        <div className="flex flex-col gap-y-5">
          <button
            type="submit"
            className={`mt-2 block w-[100%] rounded-md py-2 ${value !== "" ? "bg-[#7a3cdd]" : "bg-[#C3B1E1]"
              }`}
          >
            <span className="text-base text-gray-200">Xác nhận</span>
          </button>
          <div className="flex items-center justify-between gap-3">
            <div
              className={`w-[50%] h-1 rounded-full ${value !== "" ? "bg-[#7a3cdd]" : "bg-[#C3B1E1]"
                }`}
            ></div>
            <div
              className={`w-[50%] h-1 rounded-full ${value !== "" ? "bg-[#7a3cdd]" : "bg-[#C3B1E1]"
                }`}
            ></div>
          </div>
          <div className="flex justify-between">
            <p className="text-[1rem]">
              Đã có tài khoản?
              <Link href="/login">
                <span className="font-bold cursor-pointer ml-1">Đăng nhập</span>
              </Link>
            </p>
          </div>
        </div>
      </form>
      <Backdrop open={isPending} />
    </div>
  );
}
