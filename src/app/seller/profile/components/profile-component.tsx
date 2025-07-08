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

export default function ProfileComponent() {
  const router = useRouter();
  const userState = useAppSelector((state) => state.userSlice);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

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
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={userState?.user?.avatarUrl} />
              <AvatarFallback className="text-2xl">
                {seller?.fullName?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
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
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
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
    </div>
  );
}
