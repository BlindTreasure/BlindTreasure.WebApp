"use client";

import { Backdrop } from "@/components/backdrop";
import InputAuth from "@/components/input-auth";
import { useRegisterSellerForm } from "../hooks/useRegisterSellerForm";

export default function RegisterSellerForm() {
  const {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isPending,
    typePassword,
    typeConfirmPassword,
    handleToggleTypePassword,
    handleToggleConfirmPassword,
  } = useRegisterSellerForm();

  return (
    <div className="w-[80%] px-5 py-4 pt-10 m-auto">
      <h2 className="text-[1.5rem] leading-8 font-medium">Đăng ký người bán</h2>
      <span className="text-gray-500 inline-block mt-2">
        Vui lòng nhập thông tin để bắt đầu.
      </span>

      <form onSubmit={handleSubmit(onSubmit)} className="pt-5 flex flex-col gap-y-4">
        {/* Email */}
        <InputAuth
          id="email"
          label="Email"
          type="text"
          autoComplete="off"
          register={register("email")}
          error={errors?.email?.message}
          value=""
        />

        <InputAuth
          id="password"
          label="Mật khẩu"
          type={typePassword ? "text" : "password"}
          autoComplete="off"
          register={register("password")}
          error={errors?.password?.message}
          onClickEyePassword={handleToggleTypePassword}
          value="dummy"
        />

        <InputAuth
          id="confirmPassword"
          label="Xác nhận mật khẩu"
          type={typeConfirmPassword ? "text" : "password"}
          autoComplete="off"
          register={register("confirmPassword")}
          error={errors?.confirmPassword?.message}
          onClickEyePassword={handleToggleConfirmPassword}
          value="dummy"
        />

        <button
          type="submit"
          className="mt-4 block w-full rounded-md py-2 bg-[#7a3cdd] text-gray-200 hover:bg-[#6a32c3] disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Đang xử lý..." : "Tiếp tục"}
        </button>
      </form>

      <Backdrop open={isPending} />
    </div>
  );
}
