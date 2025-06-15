"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProvinceSelect from "@/components/province-selected";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useCreateAddress from "@/app/(user)/address-list/hooks/useCreateAddress";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import useUpdateAddress from "@/app/(user)/address-list/hooks/useUpdateAddress";

type Province = { name: string; code: number };
type District = { name: string; code: number };
type Ward = { name: string; code: number };

export default function AddressDialog({
    open,
    onClose,
    editingAddress,
}: {
    open: boolean;
    onClose: () => void;
    editingAddress: API.ResponseAddress | null;
}) {
    const isEditing = !!editingAddress;
    const {
        register,
        handleSubmit,
        control,
        onSubmit,
        watch,
        errors,
        setError,
        setValue,
        isPending,
        reset,
    } = isEditing
            ? useUpdateAddress({
                addressId: editingAddress.id,
                fullName: editingAddress.fullName,
                phone: editingAddress.phone,
                addressLine1: editingAddress.addressLine1,
                province: editingAddress.province,
                city: editingAddress.city,
                postalCode: editingAddress.postalCode ?? "",
            })
            : useCreateAddress();

    useEffect(() => {
        if (editingAddress && open) {
            reset({
                fullName: editingAddress.fullName,
                phone: editingAddress.phone,
                addressLine1: editingAddress.addressLine1,
                province: editingAddress.province,
                city: editingAddress.city,
                postalCode: editingAddress.postalCode ?? "",
            });

            setAddress({
                province: editingAddress.province ? { name: editingAddress.province, code: 0 } : null,
                district: editingAddress.city ? { name: editingAddress.city, code: 0 } : null,
                ward: editingAddress.postalCode ? { name: editingAddress.postalCode, code: 0 } : null,
            });
        } else if (open) {
            reset({
                fullName: "",
                phone: "",
                addressLine1: "",
                province: "",
                city: "",
                postalCode: "",
                isDefault: false,
            });
            setAddress({
                province: null,
                district: null,
                ward: null,
            });
        }
    }, [editingAddress, open, reset]);


    const [address, setAddress] = useState<{
        province: Province | null;
        district: District | null;
        ward: Ward | null;
    }>({
        province: null,
        district: null,
        ward: null,
    });

    const handleSelectChange = (value: {
        province: Province | null;
        district: District | null;
        ward: Ward | null;
    }) => {
        setAddress(value);

        if (value.province) setValue("province", value.province.name);
        if (value.district) setValue("city", value.district.name);
        if (value.ward) setValue("postalCode", value.ward.code.toString());
    };

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (!open) {
                reset();
                onClose();
            }
        }}>
            <DialogContent className="max-w-xl max-h-[100vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Địa chỉ mới</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit((data) => onSubmit(data, onClose))}
                    className="space-y-4"
                >

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            {...register("fullName")}
                            className="border px-3 py-2 rounded w-full"
                            placeholder="Họ và tên"
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                        )}

                        <input
                            {...register("phone")}
                            className="border px-3 py-2 rounded w-full"
                            placeholder="Số điện thoại"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone.message}</p>
                        )}
                    </div>

                    <ProvinceSelect onChange={handleSelectChange} />

                    <input
                        {...register("addressLine1")}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Địa chỉ cụ thể"
                    />

                    {!isEditing && (
                        <div className="flex items-center gap-2">
                            <Controller
                                control={control}
                                defaultValue={false}
                                name="isDefault"
                                render={({ field }) => (
                                    <>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(checked) => field.onChange(!!checked)}
                                        />
                                        <Label>Đặt làm mặc định</Label>
                                    </>
                                )}
                            />
                        </div>
                    )}

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => {
                            reset();
                            onClose();
                        }}>
                            Trở Lại
                        </Button>
                        <Button
                            type="submit"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            disabled={isPending}
                        >
                            {isPending ? "Đang lưu..." : "Hoàn thành"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
