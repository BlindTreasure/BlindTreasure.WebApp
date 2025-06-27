"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import ProvinceSelect from "@/components/province-selected"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import useCreateAddress from "@/app/(user)/address-list/hooks/useCreateAddress"
import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import useUpdateAddress from "@/app/(user)/address-list/hooks/useUpdateAddress"
import { convertAddressFromBE } from "@/utils/address"

type SimpleAddress = {
    name: string
    code: string
}

type Province = { code: string; name: string; districts: District[] };
type District = { code: string; name: string; wards: Ward[] };
type Ward = { code: string; name: string; level?: string };

export default function AddressDialog({
    open,
    onClose,
    editingAddress,
}: {
    open: boolean
    onClose: () => void
    editingAddress: API.ResponseAddress | null
}) {
    const isEditing = !!editingAddress
    const {
        register,
        handleSubmit,
        control,
        onSubmit,
        watch,
        errors,
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
        : useCreateAddress()

    const [address, setAddress] = useState<{
        province: SimpleAddress | null,
        district: SimpleAddress | null,
        ward: SimpleAddress | null,
    }>({
        province: null,
        district: null,
        ward: null,
    });

    const [provincesData, setProvincesData] = useState<Province[]>([]);

   useEffect(() => {
    fetch("/data/vietnamAddress.json")
        .then(res => res.json())
        .then(raw => {
            const parsed = raw.map((p: any) => ({
                name: p.Name,
                code: p.Id,
                districts: (p.Districts ?? []).map((d: any) => ({
                    name: d.Name,
                    code: d.Id,
                    wards: (d.Wards ?? []).map((w: any) => ({
                        name: w.Name,
                        code: w.Id,
                        level: w.Level
                    }))
                }))
            }));
            console.log("provincesData loaded:", parsed);
            setProvincesData(parsed);
        });
}, []);

useEffect(() => {
    if (!open || provincesData.length === 0) return;

    if (editingAddress) {
        const addressObj = convertAddressFromBE(editingAddress, provincesData);
        setAddress(addressObj);
        reset({
            fullName: editingAddress.fullName,
            phone: editingAddress.phone,
            addressLine1: editingAddress.addressLine1,
            province: editingAddress.province,
            city: editingAddress.city,
            postalCode: editingAddress.postalCode ?? "",
            isDefault: editingAddress.isDefault || false,
        });
    } else {
        setAddress({
            province: null,
            district: null,
            ward: null,
        });
        reset({
            fullName: "",
            phone: "",
            addressLine1: "",
            province: "",
            city: "",
            postalCode: "",
            isDefault: false,
        });
    }
}, [open, editingAddress, provincesData, reset]);

useEffect(() => {
    console.log("address state for ProvinceSelect:", address);
}, [address]);

    const handleSelectChange = (value: {
        province: SimpleAddress | null
        district: SimpleAddress | null
        ward: SimpleAddress | null
    }) => {
        setAddress(value)
        setValue("province", value.province?.name || "")
        setValue("city", value.district?.name || "")
        setValue("postalCode", value.ward?.code || "")
    }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-xl max-h-[100vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {isEditing ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit((data) => onSubmit(data, onClose))} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                {...register("fullName")}
                                className="border px-3 py-2 rounded w-full"
                                placeholder="Họ và tên"
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                            )}
                        </div>

                        <div>
                            <input
                                {...register("phone")}
                                className="border px-3 py-2 rounded w-full"
                                placeholder="Số điện thoại"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>

                    <ProvinceSelect
                        value={address}
                        onChange={handleSelectChange}
                        provincesData={provincesData}
                    />

                    <div>
                        <input
                            {...register("addressLine1")}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Địa chỉ cụ thể"
                        />
                        {errors.addressLine1 && (
                            <p className="text-red-500 text-sm mt-1">{errors.addressLine1.message}</p>
                        )}
                    </div>

                    {!isEditing && (
                        <div className="flex items-center gap-2">
                            <Controller
                                control={control}
                                name="isDefault"
                                render={({ field }) => (
                                    <>
                                        <Checkbox
                                            id="isDefault"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
                                    </>
                                )}
                            />
                        </div>
                    )}

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            disabled={isPending}
                        >
                            {isPending ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}