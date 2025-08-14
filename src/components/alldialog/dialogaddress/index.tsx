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
import useUpdateAddress from "@/app/(user)/address-list/hooks/useUpdateAddress";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import useGetProvinces from "@/app/(user)/address-list/hooks/useGetProvinces";
import useGetDistricts from "@/app/(user)/address-list/hooks/useGetDistricts";
import useGetWards from "@/app/(user)/address-list/hooks/useGetWards";

type SimpleAddress = {
    name: string;
    code: string;
};

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

    // Gọi cả hai hook luôn
    const updateMethods = useUpdateAddress(
        editingAddress
            ? {
                addressId: editingAddress.id,
                fullName: editingAddress.fullName,
                phone: editingAddress.phone,
                addressLine: editingAddress.addressLine,
                province: editingAddress.province,
                city: editingAddress.city,
                postalCode: editingAddress.postalCode ?? "",
            }
            : undefined
    );

    const createMethods = useCreateAddress();

    const methods = isEditing ? updateMethods : createMethods;

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
    } = methods;

    const [address, setAddress] = useState<{
        province: SimpleAddress | null;
        district: SimpleAddress | null;
        ward: SimpleAddress | null;
    }>({
        province: null,
        district: null,
        ward: null,
    });

    const { getProvincesApi, provinces } = useGetProvinces();
    const { getDistrictsApi } = useGetDistricts();
    const { getWardsApi } = useGetWards();

    useEffect(() => {
        if (!open) return;

        const fetchAndConvert = async () => {
            const resProvinces = await getProvincesApi();
            const provinceList = resProvinces?.value?.data ?? [];

            if (editingAddress) {
                const foundProvince = provinceList.find(
                    (p) => p.provinceName === editingAddress.province
                );

                let foundDistrict = null;
                let foundWard = null;

                if (foundProvince) {
                    const resDistricts = await getDistrictsApi({
                        provinceId: foundProvince.provinceID,
                    });

                    const districtList = resDistricts?.value?.data ?? [];

                    foundDistrict = districtList.find(
                        (d) => d.districtName === editingAddress.city
                    );

                    if (foundDistrict) {
                        const resWards = await getWardsApi({
                            districtId: foundDistrict.districtID,
                        });

                        const wardList = resWards?.value?.data ?? [];

                        foundWard = wardList.find(
                            (w) => w.wardCode.toString() === editingAddress.postalCode
                        );
                    }
                }

                setAddress({
                    province: foundProvince
                        ? {
                            code: foundProvince.provinceID.toString(),
                            name: foundProvince.provinceName,
                        }
                        : null,
                    district: foundDistrict
                        ? {
                            code: foundDistrict.districtID.toString(),
                            name: foundDistrict.districtName,
                        }
                        : null,
                    ward: foundWard
                        ? {
                            code: foundWard.wardCode.toString(),
                            name: foundWard.wardName,
                        }
                        : null,
                });

                reset({
                    fullName: editingAddress.fullName,
                    phone: editingAddress.phone,
                    addressLine: editingAddress.addressLine,
                    province: foundProvince?.provinceName || "",
                    city: foundDistrict?.districtName || "",
                    postalCode: foundWard?.wardCode?.toString() || "",
                    district: foundDistrict?.districtName || "",
                    ward: foundWard?.wardName || "",
                    isDefault: editingAddress.isDefault || false,
                });
            } else {
                setAddress({ province: null, district: null, ward: null });
                reset({
                    fullName: "",
                    phone: "",
                    addressLine: "",
                    province: "",
                    city: "",
                    postalCode: "",
                    isDefault: false,
                });
            }
        };

        fetchAndConvert();
    }, [open, editingAddress]);

    const handleSelectChange = (value: {
        province: SimpleAddress | null;
        district: SimpleAddress | null;
        ward: SimpleAddress | null;
    }) => {
        setAddress(value);
        setValue("province", value.province?.name || "");
        setValue("city", value.district?.name || "");
        setValue("postalCode", value.ward?.code || "");
        setValue("district", value.district?.name || "");
        setValue("ward", value.ward?.name || "");
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-xl max-h-[100vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {isEditing ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit((data) => onSubmit(data, () => onClose()))}
                    className="space-y-4"
                >

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                {...register("fullName")}
                                className="border px-3 py-2 rounded w-full"
                                placeholder="Họ và tên"
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <input
                                {...register("phone")}
                                className="border px-3 py-2 rounded w-full"
                                placeholder="VD: 0912345678"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <ProvinceSelect value={address} onChange={handleSelectChange} />

                    <div>
                        <input
                            {...register("addressLine")}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Địa chỉ cụ thể"
                        />
                        {errors.addressLine && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.addressLine.message}
                            </p>
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
                            {isPending
                                ? "Đang xử lý..."
                                : isEditing
                                    ? "Cập nhật"
                                    : "Thêm mới"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


