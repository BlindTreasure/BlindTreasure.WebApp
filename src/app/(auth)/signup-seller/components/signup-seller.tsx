"use client";
import { Backdrop } from "@/components/backdrop";
import InputAuth from "@/components/input-auth";
import useLoginGoogle from "@/hooks/use-login-google";
import Link from "next/link";
import { useRegisterSellerForm } from "../hooks/useRegisterSellerForm";

export default function RegisterSellerForm() {
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
    } = useRegisterSellerForm();

    const { handleLoginGoogle, isPendingGoogle } = useLoginGoogle();

    return (
        <div>
            <div className="w-[80%] px-5 py-4 pt-10 m-auto">
                <h2 className="text-[1.5rem] leading-8 font-medium">Đăng ký người bán</h2>
                <span className="text-gray-500 inline-block mt-2">
                    Tham gia ngay hôm nay để bắt đầu bán những món quà độc đáo của bạn!
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

                    <InputAuth
                        id="email"
                        label="Email"
                        type="text"
                        autoComplete="off"
                        register={register("email")}
                        error={errors?.email?.message}
                    />

                    <div className="flex gap-x-4 items-end">
                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="Code" className="text-gray-600 mt-2">
                                Mã số
                            </label>
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

                    <InputAuth
                        id="dateOfBirth"
                        label="Ngày sinh"
                        type="date"
                        autoComplete="off"
                        register={register("dateOfBirth")}
                        error={errors?.dateOfBirth?.message}
                    />

                    <InputAuth
                        id="password"
                        label="Mật khẩu"
                        type={typePassword ? "text" : "password"}
                        autoComplete="off"
                        register={register("password")}
                        error={errors?.password?.message}
                        value={valuePassword}
                        onClickEyePassword={handleToggleTypePassword}
                    />

                    <InputAuth
                        id="confirmpassword"
                        label="Xác nhận mật khẩu"
                        type={typeConfirmPassword ? "text" : "password"}
                        autoComplete="off"
                        register={register("confirmPassword")}
                        error={errors?.confirmPassword?.message}
                        value={valueConfirmPassword}
                        onClickEyePassword={handleToggleConfirmPassword}
                    />

                    {/* Thông tin doanh nghiệp */}
                    <h3 className="text-lg font-semibold mt-2 text-purple-700">Thông tin doanh nghiệp</h3>

                    <InputAuth
                        id="companyName"
                        label="Tên công ty"
                        type="text"
                        autoComplete="off"
                        register={register("companyName")}
                        error={errors?.companyName?.message}
                    />

                    <InputAuth
                        id="taxId"
                        label="Mã số thuế"
                        type="text"
                        autoComplete="off"
                        register={register("taxId")}
                        error={errors?.taxId?.message}
                    />

                    <InputAuth
                        id="companyAddress"
                        label="Địa chỉ công ty"
                        type="text"
                        autoComplete="off"
                        register={register("companyAddress")}
                        error={errors?.companyAddress?.message}
                    />

                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="coaDocumentUrl" className="text-gray-600">
                            Giấy phép ĐKKD (COA)
                        </label>
                        <input
                            id="coaDocumentUrl"
                            type="text"
                            {...register("coaDocumentUrl")}
                            className="border-2 border-gray-300 rounded-md p-2"
                        />
                        {errors?.coaDocumentUrl?.message && (
                            <p className="text-red-400 text-sm">{errors?.coaDocumentUrl?.message}</p>
                        )}
                    </div>

                    <button
                        className={`mt-4 block w-full rounded-md py-2 ${Object.keys(errors).length === 0
                                ? "bg-[#7a3cdd]"
                                : "bg-[#C3B1E1]"
                            }`}
                    >
                        <span className="text-base text-gray-200">Đăng ký người bán</span>
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
                        className="block w-full rounded-md py-2 bg-white border border-gray-400 hover:bg-gray-300"
                    >
                        <div className="flex items-center gap-2 justify-center">
                            <img
                                src="/images/Google-icon.svg"
                                alt="Login with Google"
                                width={25}
                                height={25}
                            />
                            <span className="text-base text-gray-700">Google</span>
                        </div>
                    </button>

                    <div className="text-[1rem] mt-4">
                        <p>
                            Bạn đã có tài khoản seller?
                            <Link href="/login">
                                <span className="font-bold cursor-pointer ml-1">Đăng nhập</span>
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            <Backdrop open={isPending} />
            <Backdrop open={isPendingGoogle} />
        </div>
    );
}
