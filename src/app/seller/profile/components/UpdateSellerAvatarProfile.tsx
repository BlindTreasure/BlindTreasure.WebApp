/* eslint-disable @next/next/no-img-element */
"use client";
import { useAppSelector } from "@/stores/store";
import { convertBase64ToFile } from "@/utils/Convert/ConvertBase64ToFile";
import { ChevronLeft, Plus, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CropImageAvatarProfile from "@/components/crop-image-avatar-profile";
import { Backdrop } from "@/components/backdrop";
import useToast from "@/hooks/use-toast";
import useUpdateAvatarSeller from "../hooks/useUpdateAvtSeller";

interface UpdateSellerAvatarProfileProps {
    open: boolean;
    onClose: () => void;
}

export default function UpdateSellerAvatarProfile({
    open,
    onClose,
}: UpdateSellerAvatarProfileProps) {
    const { addToast } = useToast();
    const { onSubmit, isPending } = useUpdateAvatarSeller();
    const userState = useAppSelector((state) => state.userSlice);

    const [avatarSrc, setAvatarSrc] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleUploadImage = (e: any) => {
        const newFile = e.target.files[0];
        const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];

        if (!allowedTypes.includes(newFile.type)) {
            addToast({
                type: "warning",
                description:
                    "Vui lòng tải lên tệp hình ảnh hợp lệ (jpg, jpeg, png).",
                duration: 4000,
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setAvatarSrc(reader.result as string);
        };
        reader.readAsDataURL(newFile);
    };

    const handleCancelUploadAvatar = () => {
        setAvatarSrc(null);
    };

    const handleCloseUpdateAvatar = () => {
        handleCancelUploadAvatar();
        onClose();
    };

    const handleSubmit = async (base64UrlImage: any) => {
        const cropAvatarFile = await convertBase64ToFile(
            base64UrlImage,
            `crop_avatar_seller_${userState?.user?.userId}.jpg`
        );

        try {
            onSubmit(
                {
                    file: cropAvatarFile,
                },
                handleCloseUpdateAvatar
            );
        } catch (err) { }
    };

    return (
        <Dialog open={open} onOpenChange={handleCloseUpdateAvatar}>
            <DialogContent className="bg-white select-none" hideClose>
                <div className="px-2 pt-5 pb-6 font-sans select-none">
                    {avatarSrc === null ? (
                        <div>
                            <div className="flex justify-end">
                            </div>
                            <form className="px-6">
                                <div>
                                    <h2 className="text-2xl font-bold select-text">
                                        Cập nhật avatar
                                    </h2>
                                    <p className="mt-2 text-base opacity-90 select-text">
                                        Hãy chọn một bức ảnh đại diện mới để
                                        cập nhật. Ảnh đại diện sẽ được sử dụng
                                        trên toàn bộ nền tảng của chúng tôi.
                                    </p>
                                </div>
                                <div className="py-10 flex justify-around">
                                    <figure
                                        style={{
                                            borderRadius: "50%",
                                            overflow: "hidden",
                                            width: "170px",
                                            height: "170px",
                                            position: "relative",
                                        }}
                                        className="border"
                                    >
                                        <img
                                            src={
                                                userState?.user?.avatarUrl ||
                                                "/images/avatar-default.png"
                                            }
                                            className="w-full h-full object-cover"
                                            alt="avatar"
                                        />
                                    </figure>
                                </div>
                                <div className="relative group">
                                    <input
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        type="file"
                                        ref={fileInputRef}
                                        title=""
                                        accept="image/*"
                                        onChange={handleUploadImage}
                                    />
                                    <button
                                        type="button"
                                        className="w-full flex items-center py-3 px-4 rounded-xl bg-gray-200 group-hover:bg-gray-300"
                                    >
                                        <div className="flex items-center gap-x-3">
                                            <Plus
                                                strokeWidth={2.5}
                                                className="w-6 h-6 text-gray-600 group-hover:text-gray-800"
                                            />
                                            <span className="text-lg font-medium text-gray-600 group-hover:text-gray-800">
                                                Tải lên ảnh đại diện mới
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    className="flex items-center gap-x-2 text-gray-600 hover:text-gray-800"
                                    onClick={handleCancelUploadAvatar}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Quay lại
                                </button>
                            </div>
                            <div className="text-lg font-semibold text-center mb-4">
                                Cắt ảnh đại diện
                            </div>
                            <CropImageAvatarProfile
                                image={avatarSrc}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
            <Backdrop open={isPending} />
        </Dialog>
    );
}
