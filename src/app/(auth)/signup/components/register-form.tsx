"use client";
import { useRegisterForm } from "@/app/(auth)/signup/hooks/useRegisterForm";
import { Backdrop } from "@/components/backdrop";
import InputAuth from "@/components/input-auth";
import useLoginGoogle from "@/hooks/use-login-google";
import Link from "next/link";

export default function RegisterForm() {
  const {
    register,
    errors,
    handleSubmit,
    onSubmit,
    valuePassword,
    typePassword,
    valueConfirmPassword,
    typeConfirmPassword,
    handleToggleTypePassword,
    handleToggleConfirmPassword,
    isPending,
  } = useRegisterForm();

  const { handleLoginGoogle, isPendingGoogle } = useLoginGoogle();

  return (
    <div>
      <div className="w-[80%] px-5 py-4 pt-10 m-auto">
        <h2 className="text-[1.5rem] leading-8 font-medium">Đăng ký</h2>
        <span className="text-gray-500 inline-block mt-2">
          Đăng ký ngay hôm nay để bắt đầu hành trình khám phá những món quà bí ẩn đầy bất ngờ!
        </span>
        <form
          className="pt-5 flex flex-col gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputAuth
            id="fullname"
            label="Họ và tên"
            type="text"
            autoComplete="off"
            register={register("fullName")}
            error={errors?.fullName?.message}
          />

          <div className="flex flex-col gap-y-2">
            <InputAuth
              id="email"
              label="Email"
              type="text"
              autoComplete="off"
              register={register("email")}
              error={errors?.email?.message}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="flex gap-x-4 items-end">
              <div className="flex flex-col gap-y-2">
                <div className="flex justify-between">
                  <label htmlFor="Code" className="text-gray-600 mt-2">
                    Mã số
                  </label>
                </div>
                <div
                  className={`block p-2 border-2 border-gray-300 rounded-md text-center ${errors?.phoneNumber?.message && "border-red-500"
                    }`}
                >
                  +84
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-y-2">
                <InputAuth
                  id="phonenumber"
                  label="Số điện thoại"
                  type="number"
                  autoComplete="off"
                  register={register("phoneNumber")}
                  error={errors?.phoneNumber?.message}
                />
              </div>
            </div>
            {errors?.phoneNumber?.message && (
              <p className="text-base text-red-400">
                {errors?.phoneNumber?.message}
              </p>
            )}
          </div>

          <InputAuth
            id="dateOfBirth"
            label="Ngày sinh"
            type="date"
            autoComplete="off"
            register={register("dateOfBirth")}
            error={errors?.dateOfBirth?.message}
          />

          <div className="flex flex-col gap-y-2">
            <InputAuth
              id="password"
              label="Mật khẩu"
              type={typePassword === false ? "password" : "text"}
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
              type={typeConfirmPassword === false ? "password" : "text"}
              autoComplete="off"
              register={register("confirmPassword")}
              error={errors?.confirmPassword?.message}
              value={valueConfirmPassword}
              onClickEyePassword={handleToggleConfirmPassword}
            />
          </div>
          <div className="flex flex-col gap-y-5">
            <button
              className={`mt-2 block w-[100%] rounded-md py-2 ${Object.keys(errors).length === 0
                ? "bg-[#7a3cdd]"
                : "bg-[#C3B1E1]"
                }`}
            >
              <span className="text-base text-gray-200">Đăng ký</span>
            </button>
            <div className="flex items-center justify-between gap-3">
              <div
                className={`w-[50%] h-1 rounded-full ${Object.keys(errors).length === 0
                  ? "bg-[#7a3cdd]"
                  : "bg-[#C3B1E1]"
                  }`}
              ></div>
              <span className="text-gray-400">HOẶC</span>
              <div
                className={`w-[50%] h-1 rounded-full ${Object.keys(errors).length === 0
                  ? "bg-[#7a3cdd]"
                  : "bg-[#C3B1E1]"
                  }`}
              ></div>
            </div>
            <button
              type="button"
              onClick={() => handleLoginGoogle()}
              className={`block w-[100%] rounded-md py-2 bg-white border border-gray-400 hover:bg-gray-300`}
            >
              <div className="flex items-center gap-2 justify-center">
                <img
                  src="/images/Google-icon.svg"
                  alt="Login with Google"
                  width={25}
                  height={25}
                  className="block"
                />
                <span className="text-base text-gray-700">Google</span>
              </div>
            </button>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-[1rem]">
              <p>
                Bạn có tài khoản BlindTreasure không?
                <Link href="/login">
                  <span className="font-bold cursor-pointer">Đăng nhập</span>
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
      <Backdrop open={isPending} />
      <Backdrop open={isPendingGoogle} />
    </div>
  );
}

