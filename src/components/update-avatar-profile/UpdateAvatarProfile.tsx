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
import useUpdateAvatar from "@/app/(user)/profile/information/hooks/useUpdateAvatar";

interface UpdateAvatarProfilePopupProps {
    open: boolean;
    onClose: any;
}

export default function UpdateAvatarProfilePopup({
    open,
    onClose,
}: UpdateAvatarProfilePopupProps) {
    const { addToast } = useToast();
    const { onSubmit, isPending } = useUpdateAvatar();
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
                    "Please upload a valid image file (jpg, jpeg, png).",
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
            `crop_avatar_${userState?.user?.userId}.jpg`
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
                                <button
                                    className="w-10 h-10 rounded-full text-2xl opacity-70 hover:bg-black/10 flex justify-center items-center group"
                                    onClick={handleCloseUpdateAvatar}
                                >
                                    
                                </button>
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
                                        onChange={handleUploadImage}
                                    />
                                    <button
                                        type="submit"
                                        className="w-full flex items-center py-3 px-4 rounded-xl bg-gray-200 group-hover:bg-gray-300"
                                    >
                                        <div className="flex items-center gap-x-3">
                                            <i>
                                                <Plus
                                                    strokeWidth={2.5}
                                                    className="w-6 h-6 text-gray-600 group-hover:text-gray-800"
                                                />
                                            </i>
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
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    className="w-10 h-10 rounded-full text-2xl opacity-70 hover:bg-black/10 flex justify-center items-center group"
                                    onClick={handleCancelUploadAvatar}
                                >
                                    <i>
                                        <ChevronLeft
                                            strokeWidth={2.75}
                                            className="text-gray-500 group-hover:text-gray-950 w-6 h-6"
                                        />
                                    </i>
                                </button>
                                <button
                                    className="w-10 h-10 rounded-full text-2xl opacity-70 hover:bg-black/10 flex justify-center items-center group"
                                    onClick={handleCloseUpdateAvatar}
                                >
                                    
                                </button>
                            </div>
                            <form className="mt-2 px-6 flex flex-col gap-y-2">
                                <h2 className="text-2xl font-bold">Xem trước</h2>
                                <div className="py-3">
                                    <CropImageAvatarProfile
                                        image={avatarSrc}
                                        onSubmit={handleSubmit}
                                    />
                                </div>
                            </form>
                        </div>
                    )}
                </div>
                <Backdrop open={isPending} />
            </DialogContent>
        </Dialog>
    );
}
