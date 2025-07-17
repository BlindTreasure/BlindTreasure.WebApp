"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/stores/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSellerProfile from "../hooks/useSellerProfile";
import { useState, useEffect } from "react";
import { SquareUser, Images } from "lucide-react";
import UpdateSellerAvatarProfile from "./UpdateSellerAvatarProfile";
import TippyHeadless from "@tippyjs/react/headless";
import Link from "next/link";

export default function ProfileComponent() {
  const router = useRouter();
  const userState = useAppSelector((state) => state.userSlice);
  // const persistState = useAppSelector((state) => state._persist);
const persistState = useAppSelector((state: any) => state._persist);

  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [avatarTooltip, setAvatarTooltip] = useState(false);

  const {
    seller,
    isLoading,
    error,
    form,
    isEditing,
    isSubmitting,
    onSubmit,
    handleCancel,
    handleEdit,
  } = useSellerProfile();

  const isRehydrated = persistState?.rehydrated;

  const avatarUrl = (() => {
    if (seller?.avatarUrl) {
      return seller?.avatarUrl;
    }

    if (userState.user?.avatarUrl) {
      return userState.user.avatarUrl;
    }

    return undefined;
  })();

  const isAvatarLoading = isRehydrated && !avatarUrl && (isLoading || !seller);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleToggleAvatarTooltip = () => {
    setAvatarTooltip((prev) => !prev);
  };

  const handleCloseAvatarTooltip = () => {
    setAvatarTooltip(false);
  };

  const handleOpenAvatarDialog = () => {
    setShowAvatarDialog(true);
    setAvatarTooltip(false);
  };

  const handleCloseAvatarDialog = () => {
    setShowAvatarDialog(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải thông tin...</div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Không thể tải thông tin người bán.</div>
      </div>
    );
  }

  return (
    <div className="container p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Hồ sơ của tôi</h1>
        <p className="text-gray-600 mt-2">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <TippyHeadless
              interactive
              placement="bottom-end"
              offset={[-5, 2]}
              visible={avatarTooltip}
              render={(attrs) => (
                <div
                  {...attrs}
                  className="w-[350px] max-h-[calc(min((100vh-96px)-60px),734px)] min-h-[30px] py-2 rounded-md shadow-box bg-white z-[999999]"
                >
                  <div className="py-1 px-2 flex flex-col gap-y-1">
                    <Link
                      href={avatarUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div
                        onClick={handleCloseAvatarTooltip}
                        className="px-2 py-1 flex items-center gap-x-2 rounded-md hover:bg-slate-200 select-none cursor-pointer"
                      >
                        <SquareUser
                          strokeWidth={1}
                          className="w-7 h-7 text-gray-800 opacity-80"
                        />
                        <p className="text-[15px] font-[400] text-[#1b1b1b] opacity-86">
                          Xem ảnh đại diện
                        </p>
                      </div>
                    </Link>
                    <div
                      className="px-2 py-1 flex items-center gap-x-2 rounded-md hover:bg-slate-200 select-none cursor-pointer"
                      onClick={handleOpenAvatarDialog}
                    >
                      <Images
                        strokeWidth={1}
                        className="w-7 h-7 text-gray-800 opacity-80"
                      />
                      <p className="text-[15px] font-[400] text-[#1b1b1b] opacity-86">
                        Cập nhật ảnh đại diện
                      </p>
                    </div>
                  </div>
                </div>
              )}
              onClickOutside={handleCloseAvatarTooltip}
            >
              <div
                className="relative inline-block cursor-pointer"
                onClick={handleToggleAvatarTooltip}
              >
                <Avatar className="w-24 h-24 mx-auto mb-4 hover:opacity-80 transition-opacity">
                  {isAvatarLoading ? (
                    <div className="w-full h-full bg-gray-200 animate-pulse rounded-full flex items-center justify-center">
                      <div className="text-gray-400 text-sm">Loading...</div>
                    </div>
                  ) : (
                    <>
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="text-2xl">
                        {seller?.fullName?.charAt(0) || "S"}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
              </div>
            </TippyHeadless>

            <CardTitle className="text-xl">{seller?.fullName}</CardTitle>
            <p className="text-gray-600">{seller?.email}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${seller?.isVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
                  }`}>
                  {seller?.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Thông tin cá nhân</CardTitle>
            {!isEditing ? (
              <Button onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            ) : (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <Input
                    id="phoneNumber"
                    {...register("phoneNumber")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <Input
                    key={`dateOfBirth-${seller?.email || 'default'}`}
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    max={new Date().toISOString().split("T")[0]}
                    min="1920-01-01"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Tên công ty</Label>
                  <Input
                    id="companyName"
                    {...register("companyName")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500">{errors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">Mã số thuế</Label>
                  <Input
                    id="taxId"
                    {...register("taxId")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {errors.taxId && (
                    <p className="text-sm text-red-500">{errors.taxId.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="companyAddress">Địa chỉ công ty</Label>
                  <Input
                    id="companyAddress"
                    {...register("companyAddress")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {errors.companyAddress && (
                    <p className="text-sm text-red-500">{errors.companyAddress.message}</p>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <UpdateSellerAvatarProfile
        open={showAvatarDialog}
        onClose={handleCloseAvatarDialog}
      />
    </div>
  );
}
